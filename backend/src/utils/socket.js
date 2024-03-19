const User = require('../models/user/user')
const socketIO = require('socket.io');
const cors = require('cors');
const logger = require('../utils/logger')
let ioInstance;

function bingetterSocket(server) {
  ioInstance = socketIO(server, {
    cors: {
      origin: '*',
      methods: ["GET", "POST"]
    }
  });

  ioInstance.on('connection', (socket) => {
    logger.info(`User connected in Socket: ${socket.id}`);

    socket.on('joinBingetterRoom', async ({ userId }) => {
       logger.info(`User ${socket.id} requested to join chat Room: ${userId} `);

      try {
        const user = await User.findById(userId);
        if (!user) {
          socket.emit('error', 'User not found');
        } else {
           logger.info('User connected in Notification room:', socket.id);

          socket.join(userId);
           logger.info(`User ${socket.id} joined room: ${userId}`);
          socket.emit('success', 'Room connected for Notifications');
        }
      } catch (error) {
         logger.info(error.message);
        socket.emit('error', 'User not found');
      }


    });

    socket.on('joinNotificationRoom', async ({ userId }) => {
      console.log(`User ${socket.id} requested to join chat Room: ${userId} `);

      try {
        const user = await User.findById(userId);
        if (!user) {
          socket.emit('error', 'User not found');
        } else {
          console.log('User connected in Notification room:', socket.id);

          socket.join(userId);
          console.log(`User ${socket.id} joined room: ${userId}`);
          socket.emit('success', 'Room connected for Notifications');
        }
      } catch (error) {
        console.log(error.message);
        socket.emit('error', 'User not found');
      }


    });

    socket.on('leaveRoom', (roomId) => {
      if (roomId) {
        socket.leave(roomId);
         logger.info(`User ${socket.id} left room: ${roomId}`);
      } else {
        logger.error('No room ID provided');
      }
    });

    socket.on('disconnect', () => {
       logger.info('User disconnected:', socket.id);
    });
  });
}

function getIOInstance() {
  if (!ioInstance) {
    throw new Error('Socket.IO instance not initialized');
  }
  return ioInstance;
}

module.exports = { bingetterSocket, getIOInstance };