# Slowed Down JSON Server

A slowed down version of the JSON Server to simulate (randomly) slow requests.

The following diagrams show the results of a load test, proving that the request time varies.

_HTTP Responses_
![Load Test: HTTP Responses](assets/http.responses.png)

_HTTP Response Time 2xx_
![Load Test: HTTP Response Time 2xx](assets/http.response_time.2xx.png)

## Table of Contents

- [Getting Started](#getting-started)
  - [CLI Options](#cli-options)
- [Time-Shifting Worker](#time-shifting-worker)
- [Load testing](#load-testing)

## Getting Started

Add your data to [server/db.json](server/db.json). The root keys will build your API paths.

To start the server run the following commands:

```bash
# Install the dependencies
npm install

# Start the Server
npm start
```

You should see something like:

> JSON Server is running on Port 3000

### CLI Options

You can use the following CLI options (e.g. `npm run start -- --port=4000`):

- `--port` to set the port of the server. Default is `3000`
- `--data` to set the path to your `db.json`, should be a relative path. Default is `./server/db.json`
- `--minRequestTime` to set the time a request should take at least. Default is `200`
- `--maxRequestTime` to set the time a request should take at most. Default is `2000`

## Time-Shifting Worker

Create a `.env` file in the project root with these variables (see `.env.example`):

`ZEEBE_ADDRESS=your-zeebe-address:443
ZEEBE_CLIENT_ID=your-client-id
ZEEBE_CLIENT_SECRET=your-client-secret
CAMUNDA_OAUTH_URL=https://login.cloud.camunda.io/oauth/token
ZEEBE_TOKEN_AUDIENCE=zeebe.camunda.io`

Start the worker:

`npm run worker:time-shifting`

## Documentation and Evidence

- Docs: `.md/`
- RPA evidence and screenshots: `evidence/`

## Load testing

To do a load test start the server (`npm start`) and run `npm run load-test`. Have a look at the resulting report in `reports/test-run-report.json.html`.
