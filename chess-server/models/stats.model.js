const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['site_visit', 'bot_game_started', 'game_completed'],
    required: true,
    index: true
  },
  // For game_completed events
  gameId: { type: String, default: null },
  result: { type: String, default: null }, // checkmate, draw, resignation, timeout, stalemate
  winner: { type: String, default: null }, // white, black, null (for draws)
  isBotGame: { type: Boolean, default: false },
  
  // For bot_game_started events
  skillLevel: { type: Number, default: null },
  playerColor: { type: String, default: null },
  
  // Common fields
  sessionId: { type: String, default: null },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  userAgent: { type: String, default: null },
  
  timestamp: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

// Indexes for efficient querying
statsSchema.index({ type: 1, timestamp: -1 });
statsSchema.index({ type: 1, isBotGame: 1 });

const Stats = mongoose.model('Stats', statsSchema);

module.exports = Stats;
