const express = require('express');
const router = express.Router();
const SiteVisit = require('../models/siteVisit.model');

/**
 * Get client IP from request (handles proxies)
 */
function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers['x-real-ip'] || req.ip || req.connection?.remoteAddress || null;
}

/**
 * POST /api/visit - Log a site visit (tracks all URLs per session)
 */
router.post('/', async (req, res) => {
  try {
    const { sessionId, url } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId required' });
    }

    // Try to add URL to existing session, or create new session
    const visit = await SiteVisit.findOneAndUpdate(
      { sessionId },
      {
        $setOnInsert: {
          sessionId,
          ip: getClientIp(req),
          userAgent: req.headers['user-agent'] || null,
          timestamp: new Date()
        },
        $push: {
          urls: { url: url || null, visitedAt: new Date() }
        }
      },
      { upsert: true, new: true }
    );

    const isNew = visit.urls.length === 1;
    console.log(`[Visit] ${isNew ? 'New' : 'Updated'} visit from ${visit.ip} session=${sessionId} url=${url}`);
    res.status(isNew ? 201 : 200).json({ success: true, id: visit._id, urlCount: visit.urls.length });
  } catch (error) {
    console.error('[Visit] Error logging visit:', error);
    res.status(500).json({ error: 'Failed to log visit' });
  }
});

module.exports = router;
