const router = require('express').Router();
const Favorite = require('../models/Favorite');

router.get('/', async (req, res) => {
  const favorites = await Favorite.find().sort({ savedAt: -1 });
  res.json(favorites);
});

router.post('/', async (req, res) => {
  const { gameId, gameDate, homeTeam, awayTeam, homeScore, awayScore, season, notes, tags } = req.body;
  if (!gameId || !gameDate || !homeTeam || !awayTeam || !season) {
    return res.status(400).json({ error: 'gameId, gameDate, homeTeam, awayTeam, and season are required' });
  }

  const parsedTags = Array.isArray(tags)
    ? tags
    : (tags ? String(tags).split(',').map(t => t.trim()).filter(Boolean) : []);

  const favorite = await Favorite.findOneAndUpdate(
    { gameId: Number(gameId) },
    { gameDate, homeTeam, awayTeam, homeScore, awayScore, season: Number(season), notes: notes || '', tags: parsedTags },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  res.status(201).json(favorite);
});

router.put('/:id', async (req, res) => {
  const { notes, tags } = req.body;
  const parsedTags = Array.isArray(tags)
    ? tags
    : (tags ? String(tags).split(',').map(t => t.trim()).filter(Boolean) : []);

  const favorite = await Favorite.findByIdAndUpdate(
    req.params.id,
    { notes: notes || '', tags: parsedTags },
    { new: true, runValidators: true }
  );
  if (!favorite) return res.status(404).json({ error: 'Favorite not found' });
  res.json(favorite);
});

router.delete('/:id', async (req, res) => {
  const favorite = await Favorite.findByIdAndDelete(req.params.id);
  if (!favorite) return res.status(404).json({ error: 'Favorite not found' });
  res.json({ message: 'Deleted', id: req.params.id });
});

module.exports = router;
