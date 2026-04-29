const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
  gameId:    { type: Number, required: true, unique: true },
  gameDate:  { type: Date,   required: true },
  season:    { type: Number, required: true },
  homeTeam:  { type: String, required: true },
  awayTeam:  { type: String, required: true },
  homeScore: Number,
  awayScore: Number,
  notes:     { type: String, maxlength: 500, default: '' },
  tags:      [{ type: String, maxlength: 30 }],
  savedAt:   { type: Date,   default: Date.now },
});

module.exports = mongoose.model('Favorite', FavoriteSchema);
