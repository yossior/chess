const Stats = require('../models/stats.model');

class StatsService {
  /**
   * Log a site visit
   */
  async logSiteVisit(sessionId = null, userId = null, userAgent = null) {
    try {
      await Stats.create({
        type: 'site_visit',
        sessionId,
        userId,
        userAgent
      });
      console.log(`[Stats] Site visit logged (session: ${sessionId || 'anonymous'})`);
    } catch (error) {
      console.error('[Stats] Failed to log site visit:', error.message);
    }
  }

  /**
   * Log a bot game started
   */
  async logBotGameStarted(sessionId = null, userId = null, skillLevel = null, playerColor = null) {
    try {
      await Stats.create({
        type: 'bot_game_started',
        sessionId,
        userId,
        skillLevel,
        playerColor,
        isBotGame: true
      });
      console.log(`[Stats] Bot game started (session: ${sessionId || 'anonymous'}, skill: ${skillLevel})`);
    } catch (error) {
      console.error('[Stats] Failed to log bot game started:', error.message);
    }
  }

  /**
   * Log a game completed
   */
  async logGameCompleted(gameId, result, winner, isBotGame = false, sessionId = null, userId = null) {
    try {
      await Stats.create({
        type: 'game_completed',
        gameId,
        result,
        winner,
        isBotGame,
        sessionId,
        userId
      });
      console.log(`[Stats] Game completed: ${gameId} (result: ${result}, winner: ${winner}, bot: ${isBotGame})`);
    } catch (error) {
      console.error('[Stats] Failed to log game completed:', error.message);
    }
  }

  /**
   * Get statistics summary
   */
  async getStatsSummary() {
    try {
      const [siteVisits, botGamesStarted, gamesCompleted, botGamesCompleted] = await Promise.all([
        Stats.countDocuments({ type: 'site_visit' }),
        Stats.countDocuments({ type: 'bot_game_started' }),
        Stats.countDocuments({ type: 'game_completed' }),
        Stats.countDocuments({ type: 'game_completed', isBotGame: true })
      ]);

      return {
        siteVisits,
        botGamesStarted,
        gamesCompleted,
        botGamesCompleted,
        pvpGamesCompleted: gamesCompleted - botGamesCompleted
      };
    } catch (error) {
      console.error('[Stats] Failed to get stats summary:', error.message);
      return null;
    }
  }

  /**
   * Get stats for a time period
   */
  async getStatsForPeriod(startDate, endDate = new Date()) {
    try {
      const query = {
        timestamp: { $gte: startDate, $lte: endDate }
      };

      const [siteVisits, botGamesStarted, gamesCompleted] = await Promise.all([
        Stats.countDocuments({ ...query, type: 'site_visit' }),
        Stats.countDocuments({ ...query, type: 'bot_game_started' }),
        Stats.countDocuments({ ...query, type: 'game_completed' })
      ]);

      return {
        period: { start: startDate, end: endDate },
        siteVisits,
        botGamesStarted,
        gamesCompleted
      };
    } catch (error) {
      console.error('[Stats] Failed to get stats for period:', error.message);
      return null;
    }
  }
}

module.exports = new StatsService();
