import { Camunda8 } from '@camunda8/sdk';
import dotenv from 'dotenv';

dotenv.config({ path: 'C:/HKA/4Sem/AVG/service_simulation/.env' });

const zeebeAddress = process.env.ZEEBE_ADDRESS || process.env.CAMUNDA_ZEEBE_ADDRESS;
const zeebeClientId = process.env.ZEEBE_CLIENT_ID;
const zeebeClientSecret = process.env.ZEEBE_CLIENT_SECRET;
const camundaOauthUrl =
  process.env.CAMUNDA_OAUTH_URL || process.env.ZEEBE_AUTH_SERVER_URL || process.env.ZEEBE_AUTHORIZATION_SERVER_URL;
const zeebeTokenAudience = process.env.ZEEBE_TOKEN_AUDIENCE || process.env.CAMUNDA_ZEEBE_OAUTH_AUDIENCE;

if (!zeebeAddress || !zeebeClientId || !zeebeClientSecret || !camundaOauthUrl) {
  console.error('Missing Zeebe env vars');
  process.exit(1);
}

const c8 = new Camunda8({
  zeebeAddress,
  zeebeClientId,
  zeebeClientSecret,
  camundaOauthUrl,
  zeebeTokenAudience,
});

const zeebe = c8.getZeebeGrpcApiClient();

zeebe.createWorker({
  taskType: 'rpa-legacy-entry', // muss exakt so heißen wie im BPMN
  workerName: 'rpa-legacy-entry-worker',
  maxJobsToActivate: 5,
  timeout: 60_000,
  taskHandler: async (job) => {
    // hier könntest du später deinen "Legacy"-Call machen
    return job.complete({
      legacyId: job.variables?.auftragId ?? null,
      rpaDone: true,
    });
  },
});

console.log("Worker 'rpa-legacy-entry-worker' started for type 'rpa-legacy-entry'.");
