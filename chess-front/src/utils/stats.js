/**
 * Stats tracking utility for the chess frontend
 * Logs visits, bot games, and game completions to the server
 */

// Generate or retrieve a session ID for this browser session
function getSessionId() {
  let sessionId = sessionStorage.getItem('chess_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    sessionStorage.setItem('chess_session_id', sessionId);
  }
  return sessionId;
}

// Get user ID from localStorage if available
function getUserId() {
  try {
    const token = localStorage.getItem('chess_token');
    if (token) {
      // Decode JWT to get user ID (simple decode, no verification needed on client)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id || payload._id || null;
    }
  } catch (e) {
    // Ignore decode errors
  }
  return null;
}

/**
 * Log a site visit
 */
export async function logSiteVisit() {
  try {
    // Only log once per session
    if (sessionStorage.getItem('chess_visit_logged')) {
      return;
    }
    
    await fetch('/api/stats/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: getSessionId(),
        userId: getUserId()
      })
    });
    
    sessionStorage.setItem('chess_visit_logged', 'true');
    console.log('[Stats] Site visit logged');
  } catch (error) {
    console.error('[Stats] Failed to log site visit:', error);
  }
}

/**
 * Generate a unique game ID for bot games
 */
function generateBotGameId() {
  return 'bot_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
}

// Store bot game info for later use when game completes
const activeBotGames = new Map();

/**
 * Log when a bot game is started
 * Returns the generated gameId so it can be used for game completion tracking
 */
export async function logBotGameStarted(skillLevel, playerColor, isUnbalanced = true) {
  const gameId = generateBotGameId();
  
  // Store game info for later use when game completes
  activeBotGames.set(gameId, {
    skillLevel,
    playerColor,
    isUnbalanced,
    startedAt: new Date().toISOString()
  });
  
  try {
    await fetch('/api/stats/bot-game-started', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: getSessionId(),
        userId: getUserId(),
        skillLevel,
        playerColor,
        gameId
      })
    });
    console.log('[Stats] Bot game started logged:', gameId);
    return gameId;
  } catch (error) {
    console.error('[Stats] Failed to log bot game started:', error);
    return gameId; // Still return the ID even if logging failed
  }
}

/**
 * Log when a game is completed
 * For bot games, also saves the game to the games collection with all moves
 * @param {string} gameId - The game ID
 * @param {string} result - The result (checkmate, draw, resignation, timeout, stalemate)
 * @param {string} winner - The winner (white, black, or null for draw)
 * @param {boolean} isBotGame - Whether this is a bot game
 * @param {object} gameData - Optional game data for bot games { moves: [], fen: string }
 */
export async function logGameCompleted(gameId, result, winner, isBotGame = false, gameData = null) {
  try {
    // Get stored bot game info if this is a bot game
    const botGameInfo = isBotGame ? activeBotGames.get(gameId) : null;
    
    // Clean up stored bot game info
    if (isBotGame && gameId) {
      activeBotGames.delete(gameId);
    }
    
    await fetch('/api/stats/game-completed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gameId: gameId || `bot_${Date.now()}`,
        result,
        winner,
        isBotGame,
        sessionId: getSessionId(),
        userId: getUserId(),
        // Include game data for bot games so they can be saved to the games collection
        moves: gameData?.moves || [],
        fen: gameData?.fen || null,
        skillLevel: botGameInfo?.skillLevel || null,
        playerColor: botGameInfo?.playerColor || null,
        isUnbalanced: botGameInfo?.isUnbalanced ?? true,
        startedAt: botGameInfo?.startedAt || null
      })
    });
    console.log('[Stats] Game completed logged:', { result, winner, isBotGame, movesCount: gameData?.moves?.length || 0 });
  } catch (error) {
    console.error('[Stats] Failed to log game completed:', error);
  }
}
