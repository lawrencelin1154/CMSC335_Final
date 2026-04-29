const axios = require('axios');

const BASE_URL = 'https://api.balldontlie.io/v1';

const tokenBucket = { tokens: 5, lastRefill: Date.now() };
const REFILL_INTERVAL_MS = 12000;

function acquireToken() {
  const now = Date.now();
  const elapsed = now - tokenBucket.lastRefill;
  const refills = Math.floor(elapsed / REFILL_INTERVAL_MS);
  if (refills > 0) {
    tokenBucket.tokens = Math.min(5, tokenBucket.tokens + refills);
    tokenBucket.lastRefill = now;
  }
  if (tokenBucket.tokens < 1) {
    const waitMs = REFILL_INTERVAL_MS - (now - tokenBucket.lastRefill);
    return new Promise(resolve => setTimeout(() => { tokenBucket.tokens--; resolve(); }, waitMs));
  }
  tokenBucket.tokens--;
  return Promise.resolve();
}

async function bdlGet(path, params = {}) {
  await acquireToken();
  let lastErr;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await axios.get(`${BASE_URL}${path}`, {
        params,
        headers: { Authorization: process.env.BDL_API_KEY },
      });
      return res.data;
    } catch (err) {
      lastErr = err;
      const status = err.response?.status;
      const body = JSON.stringify(err.response?.data);
      console.warn(`balldontlie attempt ${attempt} failed: status=${status} body=${body} path=${path}`);
      if (status !== 429 && status !== 503) break;
      await new Promise(r => setTimeout(r, 1000 * attempt));
    }
  }
  const status = lastErr.response?.status;
  const body = JSON.stringify(lastErr.response?.data);
  const err = new Error(`balldontlie error: status=${status} body=${body} path=${path}`);
  err.status = status;
  throw err;
}

module.exports = { bdlGet };
