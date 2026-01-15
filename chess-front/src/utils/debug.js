/**
 * Debug Logging Utility
 * 
 * Logs are shown by default on localhost (development).
 * In production, enable via console: window.debug(true)
 * 
 * Usage:
 *   import { log } from '../utils/debug';
 *   log('[Component] message', data);
 */

// Default: enabled on localhost only
let DEBUG_ENABLED = typeof window !== 'undefined' && 
  (window.location?.hostname === 'localhost' || window.location?.hostname === '127.0.0.1');

/**
 * Toggle debug logging
 * @param {boolean} enabled - true to enable, false to disable
 */
export function setDebug(enabled) {
  DEBUG_ENABLED = enabled;
  console.log(`[Debug] Logging ${enabled ? 'ENABLED' : 'DISABLED'}`);
}

/**
 * Check if debug is enabled
 * @returns {boolean}
 */
export function isDebugEnabled() {
  return DEBUG_ENABLED;
}

/**
 * Debug log - only outputs when DEBUG_ENABLED is true
 * @param  {...any} args - Arguments to log
 */
export function log(...args) {
  if (DEBUG_ENABLED) {
    console.log(...args);
  }
}

/**
 * Debug warn - only outputs when DEBUG_ENABLED is true
 * @param  {...any} args - Arguments to warn
 */
export function warn(...args) {
  if (DEBUG_ENABLED) {
    console.warn(...args);
  }
}

/**
 * Debug error - always outputs (errors are important)
 * @param  {...any} args - Arguments to error
 */
export function error(...args) {
  console.error(...args);
}

// Expose globally for console toggle in production
if (typeof window !== 'undefined') {
  window.debug = setDebug;
  window.isDebugEnabled = isDebugEnabled;
  
  // Show hint on first load (only in production)
  if (!DEBUG_ENABLED) {
    console.log('[Debug] Logs hidden. Enable with: window.debug(true)');
  }
}
