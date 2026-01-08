import express from 'express';
import jsonServer from 'json-server';
import { randomIntFromInterval, slowDown } from './slow.utils.js';
import commandLineArgs from 'command-line-args';
import { fileURLToPath } from 'url';
import path from 'path';
import { ZBClient } from 'zeebe-node';
import 'dotenv/config';

const server = express();

const optionDefinitions = [
  { name: 'port', alias: 'v', type: Number, multiple: false, defaultValue: 3000 },
  { name: 'data', alias: 'd', type: String, multiple: false, defaultValue: './server/db.json' },
  { name: 'minRequestTime', type: Number, multiple: false, defaultValue: 200 },
  { name: 'maxRequestTime', type: Number, multiple: false, defaultValue: 2000 },
];

const options = commandLineArgs(optionDefinitions);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * IMPORTANT: JSON body parser MUST be registered before routes
 */
server.use(express.json());

/**
 * OPTIONAL: artificial latency (your existing behavior)
 */
server.use(async (req, res, next) => {
  const delay = randomIntFromInterval(options.minRequestTime, options.maxRequestTime);
  await slowDown(delay);
  next();
});

/**
 * Zeebe client for Camunda 8 SaaS (needs env vars)
 */
const zbc = new ZBClient(process.env.ZEEBE_ADDRESS, {
  oauth: {
    url: process.env.ZEEBE_AUTHORIZATION_SERVER_URL,
    audience: process.env.ZEEBE_TOKEN_AUDIENCE,
    clientId: process.env.ZEEBE_CLIENT_ID,
    clientSecret: process.env.ZEEBE_CLIENT_SECRET,
  },
});

/**
 * Abort endpoint: publishes BPMN message to interrupt the subprocess
 * Body: { "auftragId": "..." }
 */
server.post('/abort', async (req, res) => {
  try {
    const { auftragId } = req.body ?? {};
    if (!auftragId) {
      return res.status(400).json({ ok: false, error: 'Missing auftragId in JSON body' });
    }

    await zbc.publishMessage({
      name: 'AbbruchRisikoanalyse',
      correlationKey: String(auftragId),
      timeToLive: 60_000,
    });

    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err?.message ?? String(err),
    });
  }
});

/**
 * json-server routes (e.g., /risk, etc.) from db.json
 * Must come AFTER custom routes like /abort
 */
server.use(jsonServer.router(path.join(__dirname, options.data)));

server.listen(options.port, () => {
  console.log(`JSON Server is running on Port ${options.port}`);
});
