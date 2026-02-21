// config/socket.js
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io = null;

/**
 * Initialize Socket.io and attach to the HTTP server.
 * @param {http.Server} httpServer
 * @returns {Server}
 */
function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_ORIGIN || '*',
      credentials: true,
    },
  });

  // JWT authentication middleware for WebSocket
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;

    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      next();
    } catch {
      return next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.userId}`);

    // Join user-specific room for targeted notifications
    socket.join(`user:${socket.userId}`);

    socket.on('disconnect', () => {
      console.log(`🔌 User disconnected: ${socket.userId}`);
    });
  });

  return io;
}

/**
 * Get the Socket.io instance. Returns null if not initialized.
 */
function getIO() {
  return io;
}

/**
 * Send a notification to a specific user via WebSocket.
 */
function emitToUser(userId, event, data) {
  if (!io) return;
  io.to(`user:${userId}`).emit(event, data);
}

/**
 * Broadcast to all connected users.
 */
function emitToAll(event, data) {
  if (!io) return;
  io.emit(event, data);
}

module.exports = { initSocket, getIO, emitToUser, emitToAll };
