// models/AuditLog.js
const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: [
      'USER_SIGNUP', 'USER_LOGIN', 'USER_LOGIN_FAILED',
      'PRESCRIPTION_CREATED', 'PRESCRIPTION_UPDATED', 'PRESCRIPTION_DELETED', 'PRESCRIPTION_EMAILED',
      'PROFILE_UPDATED', 'PROFILE_PICTURE_UPLOADED',
      'USER_ROLE_CHANGED', 'USER_DELETED',
      'MEDICINE_SEARCHED',
    ],
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },
  resourceType: {
    type: String,
    enum: ['User', 'Prescription', 'Medicine', 'System'],
  },
  resourceId: { type: mongoose.Schema.Types.ObjectId },
  details: { type: mongoose.Schema.Types.Mixed },
  ipAddress: { type: String },
  userAgent: { type: String },
  createdAt: { type: Date, default: Date.now, index: true },
});

// TTL index — auto-delete logs older than 90 days
auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
