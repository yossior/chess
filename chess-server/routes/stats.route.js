const express = require('express');
const router = express.Router();
const statsService = require('../services/stats.service');

/**
 * POST /api/stats/visit
 * Log a site visit
 */
router.post('/visit', async (req, res) => {
  const { sessionId, userId } = req.body;
  const userAgent = req.headers['user-agent'];
  
  await statsService.logSiteVisit(sessionId, userId, userAgent);
  res.status(200).json({ success: true });
});

/**
 * POST /api/stats/bot-game-started
 * Log when a bot game is started
 */
router.post('/bot-game-started', async (req, res) => {
  const { sessionId, userId, skillLevel, playerColor } = req.body;
  
  await statsService.logBotGameStarted(sessionId, userId, skillLevel, playerColor);
  res.status(200).json({ success: true });
});

/**
 * POST /api/stats/game-completed
 * Log when a game is completed (can also be called from frontend for bot games)
 */
router.post('/game-completed', async (req, res) => {
  const { gameId, result, winner, isBotGame, sessionId, userId } = req.body;
  
  await statsService.logGameCompleted(gameId, result, winner, isBotGame, sessionId, userId);
  res.status(200).json({ success: true });
});

/**
 * GET /api/stats/summary
 * Get statistics summary
 */
router.get('/summary', async (req, res) => {
  const stats = await statsService.getStatsSummary();
  
  if (stats) {
    res.status(200).json(stats);
  } else {
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

/**
 * GET /api/stats/today
 * Get today's statistics
 */
router.get('/today', async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const stats = await statsService.getStatsForPeriod(today);
  
  if (stats) {
    res.status(200).json(stats);
  } else {
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

module.exports = router;
