/**
 * Marseillais Chess Engine Worker
 * 
 * High-performance engine using Int8Array mailbox representation
 * Optimized for Double-Move Chess with Minimax and alpha-beta pruning
 */

import {
  GameState,
  findBestTurn,
  getMoveFrom,
  getMoveTo,
  getMovePromotion,
  squareToAlgebraic,
  moveToSan,
  makeMove,
  turnToString,
  WHITE,
  BLACK,
  setEngineDebug,
} from './double-move-engine.js';

// ============================================================================
// DEBUG LOGGING
// Enable in production via console: postMessage({type:'debug',enabled:true})
// ============================================================================
let DEBUG = typeof process !== 'undefined' && process.env?.NODE_ENV === 'development' || 
            (typeof location !== 'undefined' && location.hostname === 'localhost');

function log(...args) {
  if (DEBUG) console.log(...args);
}

log('[marseillais-engine-v2.worker] Worker initialized');

// ============================================================================
// SKILL LEVEL -> DEPTH MAPPING
// ============================================================================

function getSearchDepth(skillLevel) {
  // Depth = number of TURNS to look ahead
  // Hanging piece detection handles tactical threats at leaf nodes
  switch (skillLevel) {
    case 1: return 2;  // Easy
    case 2: return 2;  // Medium - relies on tactical eval
    case 3: return 3;  // Hard
    default: return 2;
  }
}

// ============================================================================
// MAIN SEARCH
// ============================================================================

function findBestMoveFromFen(fen, skillLevel, maxMoves = 2) {
  const state = new GameState();
  state.loadFen(fen);
  
  const depth = getSearchDepth(skillLevel);
  log(`[Engine] Searching at depth ${depth} (skill ${skillLevel}), maxMoves ${maxMoves}`);
  
  const turn = findBestTurn(state, depth, undefined, maxMoves);
  
  if (!turn || turn.length === 0) {
    return null;
  }
  
  // Convert internal moves to the format expected by the game
  const result = [];
  
  for (const move of turn) {
    const from = getMoveFrom(move);
    const to = getMoveTo(move);
    const promotion = getMovePromotion(move);
    
    const fromAlg = squareToAlgebraic(from);
    const toAlg = squareToAlgebraic(to);
    
    const moveObj = {
      from: fromAlg,
      to: toAlg,
      san: moveToSan(state, move),
    };
    
    if (promotion) {
      const promoChars = ['', 'p', 'n', 'b', 'r', 'q', 'k'];
      moveObj.promotion = promoChars[promotion];
    }
    
    result.push(moveObj);
    
    // Apply move to state for next iteration's SAN
    makeMove(state, move);
  }
  
  log(`[Engine] Best turn: ${result.map(m => m.san).join(' ')}`);
  
  return result;
}

// ============================================================================
// WORKER MESSAGE HANDLER
// ============================================================================

self.onmessage = function(e) {
  const { type, fen, skillLevel, requestId, maxMoves = 2 } = e.data;
  
  // Toggle debug mode from console: worker.postMessage({type:'debug',enabled:true})
  if (type === 'debug') {
    DEBUG = e.data.enabled;
    setEngineDebug(DEBUG); // Also toggle in engine
    console.log(`[Engine] Debug mode: ${DEBUG ? 'ON' : 'OFF'}`);
    return;
  }
  
  if (type === 'init') {
    self.postMessage({ type: 'ready' });
    return;
  }
  
  if (type === 'findBestMove') {
    try {
      log(`[Engine] Skill ${skillLevel}, maxMoves ${maxMoves}`);
      
      const bestTurn = findBestMoveFromFen(fen, skillLevel, maxMoves);
      
      if (bestTurn && bestTurn.length > 0) {
        self.postMessage({
          type: 'bestMove',
          move: bestTurn,
          requestId,
        });
      } else {
        self.postMessage({
          type: 'error',
          error: 'No legal moves available',
          requestId,
        });
      }
    } catch (err) {
      console.error('[Engine Error]', err);
      self.postMessage({
        type: 'error',
        error: err.message,
        requestId,
      });
    }
  }
};
