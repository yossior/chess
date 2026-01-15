const mongoose = require('mongoose');

/**
 * Game Schema
 * For human-vs-human (PvP) games only
 * Bot games are stored in the BotGame collection
 */
const gameSchema = new mongoose.Schema({
  gameId: { type: String, unique: true, sparse: true, index: true },
  
  // White player
  white: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false, default: null },
  whiteSessionId: { type: String, required: false, default: null },
  whiteIp: { type: String, required: false, default: null },
  whiteUserAgent: { type: String, required: false, default: null },
  
  // Black player  
  black: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false, default: null },
  blackSessionId: { type: String, required: false, default: null },
  blackIp: { type: String, required: false, default: null },
  blackUserAgent: { type: String, required: false, default: null },
  
  // Game state
  fen: { type: String, default: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' },
  moves: [{ type: String }],
  isUnbalanced: { type: Boolean, default: true },
  
  // Clock times in milliseconds
  whiteMs: { type: Number, default: 300000 },
  blackMs: { type: Number, default: 300000 },
  increment: { type: Number, default: 2000 },
  
  // Game status
  status: {
    type: String,
    enum: ['waiting', 'in_progress', 'completed'],
    default: 'waiting'
  },
  
  // Game result (only if completed)
  result: {
    type: String,
    enum: ['checkmate', 'draw', 'resignation', 'timeout', 'stalemate', 'abandonment', 'agreement', null],
    default: null
  },
  winner: {
    type: String,
    enum: ['white', 'black', null],
    default: null
  },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  startedAt: { type: Date, default: null },
  completedAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Game', gameSchema);
