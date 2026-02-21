// middleware/auditLogger.js
const AuditLog = require('../models/AuditLog');

/**
 * Logs an audit event asynchronously (non-blocking).
 *
 * @param {string} action - e.g. 'PRESCRIPTION_CREATED'
 * @param {string|null} userId - ID of the user performing the action
 * @param {string} resourceType - e.g. 'Prescription', 'User'
 * @param {string|null} resourceId - ID of the affected resource
 * @param {object} details - Additional context
 * @param {object} req - Express request (for IP/UA extraction)
 */
async function logAudit(action, userId, resourceType, resourceId, details, req) {
  try {
    await AuditLog.create({
      action,
      userId: userId || undefined,
      resourceType,
      resourceId: resourceId || undefined,
      details,
      ipAddress: req?.ip || req?.connection?.remoteAddress || 'unknown',
      userAgent: req?.headers?.['user-agent'] || 'unknown',
    });
  } catch (err) {
    // Never let audit logging crash the request
    console.error('Audit log error:', err.message);
  }
}

module.exports = { logAudit };
