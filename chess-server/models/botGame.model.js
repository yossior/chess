const mongoose = require('mongoose');

/**
 * Bot Game Schema
 * Stores bot games when they complete or are abandoned
 */
const botGameSchema = new mongoose.Schema({
  gameId: { type: String, unique: true, required: true, index: true },
  
  // Human player info
  humanColor: { type: String, enum: ['w', 'b'], required: true },
  humanIp: { type: String, required: false, default: null },
  
  // Game settings
  isUnbalanced: { type: Boolean, default: true },
  
  // Game data
  moves: [{ type: String }],
  fen: { type: String, default: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' },
  
  // Game result
  status: {
    type: String,
    enum: ['completed', 'abandoned'],
    required: true
  },
  result: {
    type: String,
    enum: ['checkmate', 'draw', 'resignation', 'timeout', 'stalemate', 'abandonment', 'repetition', 'fifty-move', null],
    default: null
  },
  winner: {
    type: String,
    enum: ['white', 'black', null],
    default: null
  },
  
  // Timestamps
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('BotGame', botGameSchema);
