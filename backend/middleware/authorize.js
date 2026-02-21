// middleware/authorize.js
// Role-based access control middleware — use after verifyToken

/**
 * Restricts access to users with specific roles.
 * @param  {...string} roles - Allowed roles, e.g. 'admin', 'doctor'
 * @returns Express middleware
 *
 * Usage:
 *   router.get('/admin-only', verifyToken, authorize('admin'), handler)
 *   router.get('/doc-or-admin', verifyToken, authorize('doctor', 'admin'), handler)
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role(s): ${roles.join(', ')}. Your role: ${req.user.role}`,
      });
    }

    next();
  };
};

module.exports = authorize;
