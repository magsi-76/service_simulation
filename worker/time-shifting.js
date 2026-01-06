import { Camunda8 } from '@camunda8/sdk';

const zeebeAddress = process.env.ZEEBE_ADDRESS;
const zeebeClientId = process.env.ZEEBE_CLIENT_ID;
const zeebeClientSecret = process.env.ZEEBE_CLIENT_SECRET;
const zeebeAuthServerUrl = process.env.ZEEBE_AUTH_SERVER_URL;

if (!zeebeAddress || !zeebeClientId || !zeebeClientSecret || !zeebeAuthServerUrl) {
  console.error(
    'Missing Zeebe env vars. Set ZEEBE_ADDRESS, ZEEBE_CLIENT_ID, ZEEBE_CLIENT_SECRET, ZEEBE_AUTH_SERVER_URL.'
  );
  process.exit(1);
}

const c8 = new Camunda8({
  zeebeAddress,
  zeebeClientId,
  zeebeClientSecret,
  zeebeAuthServerUrl,
});

const zeebe = c8.getZeebeGrpcApiClient();

// Time-shifting worker: uses Carbon Aware API when configured, otherwise falls back.
const jobType = 'time-shifting';
const workerName = 'time-shifting-worker';

zeebe.createWorker({
  taskType: jobType,
  taskHandler: async (job) => {
    const now = Date.now();
    const fallbackMinutes = Number(process.env.SHIFT_MINUTES || '15');
    const carbonApiUrl = process.env.CARBON_API_URL;

    let shiftStartTime;
    let co2ChosenWindow;

    if (carbonApiUrl) {
      try {
        const res = await fetch(carbonApiUrl, {
          method: 'GET',
          headers: { accept: 'application/json' },
        });

        if (!res.ok) {
          throw new Error(`Carbon API HTTP ${res.status}`);
        }

        const data = await res.json();
        const windows = Array.isArray(data) ? data : data?.forecast;

        if (!Array.isArray(windows) || windows.length === 0) {
          throw new Error('Carbon API returned no forecast windows');
        }

        const best = windows.reduce((min, cur) => (cur.carbonIntensity < min.carbonIntensity ? cur : min));

        shiftStartTime = best.startTime;
        co2ChosenWindow = best;
      } catch (err) {
        console.warn('Carbon API failed, using fallback:', err.message);
      }
    }

    if (!shiftStartTime) {
      shiftStartTime = new Date(now + fallbackMinutes * 60 * 1000).toISOString();
    }

    return job.complete({
      shiftStartTime,
      co2ChosenWindow,
    });
  },
  workerName,
  maxJobsToActivate: 5,
  timeout: 60_000,
});

console.log(`Worker '${workerName}' started for type '${jobType}'.`);
