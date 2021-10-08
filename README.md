# Sample W3C Node.js Trace Context App
This is an example app that is to be used with [W3C Trace Context Tester](https://github.com/w3c/trace-context/tree/main/test) to prove the
[New Relic Node.js Agent](https://github.com/newrelic/node-newrelic) is in compliance with the trace context spec.

## How to use
**Note**: You must have a New Relic account and have env var of `NEW_RELIC_LICENSE_KEY` set for your API key.

### Start sample app
```
npm ci
node -r newrelic server.js
```

### Setup w3c trace-context harness
```
git clone git@github.com:w3c/trace-context.git
cd trace-context/test
python3 -m venv venv
source venv/bin/activate
pip install aiohttp

# Run tests against our http outbound module
STRICT_LEVEL=1 python test.py http://localhost:3000/dt

# Run tests against our undici http client module
STRICT_LEVEL=1 python test.py http://localhost:3000/http
```
