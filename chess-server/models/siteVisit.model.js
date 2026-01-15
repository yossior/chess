const mongoose = require('mongoose');

const siteVisitSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true, index: true },
  ip: { type: String, default: null },
  userAgent: { type: String, default: null },
  urls: [{
    url: { type: String },
    visitedAt: { type: Date, default: Date.now }
  }],
  timestamp: { type: Date, default: Date.now, index: true }
});

module.exports = mongoose.model('SiteVisit', siteVisitSchema);
