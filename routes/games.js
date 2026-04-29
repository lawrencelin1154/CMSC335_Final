const router = require('express').Router();
const { bdlGet } = require('../lib/balldontlie');

const cache = {};

router.get('/lebron', async (req, res) => {
  if (cache.lebron) return res.json(cache.lebron);
  const data = await bdlGet('/players', { search: 'LeBron' });
  const lebron = data.data.find(p => p.first_name === 'LeBron' && p.last_name === 'James');
  if (!lebron) return res.status(404).json({ error: 'LeBron James not found in API' });
  cache.lebron = lebron;
  res.json(lebron);
});

router.get('/teams', async (req, res) => {
  if (cache.teams) return res.json(cache.teams);
  const data = await bdlGet('/teams');
  cache.teams = data.data;
  res.json(data.data);
});

router.get('/list', async (req, res) => {
  const { season, team_ids, cursor, per_page } = req.query;
  if (!season) return res.status(400).json({ error: 'season is required' });

  const params = { seasons: [season], per_page: per_page || 25 };
  if (team_ids) params['team_ids[]'] = team_ids;
  if (cursor) params.cursor = cursor;

  const data = await bdlGet('/games', params);
  res.json(data);
});

module.exports = router;
