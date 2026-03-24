// backend/infrastructure/realtime/socketIO.js
// Socket.IO Real-Time Chat Configuration - Adapter Layer

const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const supabase = require('../database/supabaseClient');

// Track active connections
const activeConnections = new Map(); // userId -> socketId

let io;

const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: process.env.SOCKET_IO_CORS?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],
      credentials: true,
    },
    transports: ['websocket', 'polling'], // Fallback for browsers that don't support websockets
  });

  // Middleware: Verify JWT on connection
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Verify user exists in Supabase
      const { data: user, error } = await supabase
        .from('users')
        .select('id, email, role')
        .eq('id', decoded.userId)
        .single();

      if (error || !user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.userId = decoded.userId;
      socket.userEmail = user.email;
      socket.userRole = user.role;
      
      next();
    } catch (error) {
      console.error('Socket authentication error:', error);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // Handle new connections
  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.userId} (${socket.userEmail})`);
    activeConnections.set(socket.userId, socket.id);

    // Broadcast user online status
    socket.broadcast.emit('user:online', { userId: socket.userId });

    // ===== MESSAGE EVENTS =====

    // User joins a conversation
    socket.on('conversation:join', (conversationId) => {
      socket.join(conversationId);
      console.log(`User ${socket.userId} joined conversation: ${conversationId}`);
      
      // Notify others in conversation
      socket.to(conversationId).emit('user:typing_stopped', { userId: socket.userId });
    });

    // User leaves a conversation
    socket.on('conversation:leave', (conversationId) => {
      socket.leave(conversationId);
      console.log(`User ${socket.userId} left conversation: ${conversationId}`);
    });

    // Send message
    socket.on('message:send', async (data) => {
      try {
        const { conversationId, content, receiverId, attachments } = data;

        // Validate message
        if (!content && (!attachments || attachments.length === 0)) {
          socket.emit('error', 'Message cannot be empty');
          return;
        }

        // Save message to Supabase
        const { data: message, error } = await supabase
          .from('messages')
          .insert({
            conversation_id: conversationId,
            sender_id: socket.userId,
            receiver_id: receiverId,
            content,
            message_type: attachments ? 'file' : 'text',
            attachment_urls: attachments || [],
            status: 'sent',
          })
          .select()
          .single();

        if (error) {
          console.error('Error saving message:', error);
          socket.emit('error', 'Failed to send message');
          return;
        }

        // Emit to both sender and receiver
        io.to(conversationId).emit('message:received', {
          id: message.id,
          senderId: socket.userId,
          content,
          attachments,
          timestamp: message.created_at,
          status: 'delivered',
        });

        // Emit delivered status
        socket.emit('message:delivered', { messageId: message.id });
      } catch (error) {
        console.error('Error handling message:send:', error);
        socket.emit('error', 'Message sending failed');
      }
    });

    // Mark message as read
    socket.on('message:read', async (data) => {
      try {
        const { messageId, conversationId } = data;

        // Update in Supabase
        const { error } = await supabase
          .from('messages')
          .update({ status: 'read', read_at: new Date() })
          .eq('id', messageId);

        if (!error) {
          // Emit read receipt
          io.to(conversationId).emit('message:read', { messageId });
        }
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    });

    // ===== TYPING INDICATORS =====

    socket.on('user:typing', (data) => {
      const { conversationId } = data;
      socket.to(conversationId).emit('user:typing', { userId: socket.userId });
    });

    socket.on('user:typing_stopped', (data) => {
      const { conversationId } = data;
      socket.to(conversationId).emit('user:typing_stopped', { userId: socket.userId });
    });

    // ===== ONLINE STATUS =====

    socket.on('user:status_update', (data) => {
      const { status } = data; // 'online', 'away', 'offline'
      io.emit('user:status_changed', { userId: socket.userId, status });
    });

    // ===== FILE UPLOAD =====

    socket.on('file:upload_start', (data) => {
      const { conversationId, fileName, fileSize } = data;
      socket.to(conversationId).emit('file:upload_start', {
        userId: socket.userId,
        fileName,
        fileSize,
      });
    });

    socket.on('file:upload_complete', (data) => {
      const { conversationId, fileUrl, fileName } = data;
      socket.to(conversationId).emit('file:uploaded', {
        userId: socket.userId,
        fileUrl,
        fileName,
      });
    });

    // ===== CONSULTATION NOTIFICATIONS =====

    socket.on('consultation:booking_requested', (data) => {
      const { consultantId, consultationId, serviceId } = data;
      
      // Notify consultant if they're online
      const consultantSocket = activeConnections.get(consultantId);
      if (consultantSocket) {
        io.to(consultantSocket).emit('notification:consultation_request', {
          consultationId,
          serviceId,
          clientId: socket.userId,
        });
      }
    });

    socket.on('consultation:accepted', (data) => {
      const { clientId, consultationId } = data;
      
      // Notify client
      const clientSocket = activeConnections.get(clientId);
      if (clientSocket) {
        io.to(clientSocket).emit('notification:consultation_accepted', {
          consultationId,
        });
      }
    });

    socket.on('consultation:reminder', (conversationId) => {
      const { consultationId } = data;
      io.to(conversationId).emit('notification:consultation_reminder', {
        consultationId,
        message: 'Your consultation is starting soon',
      });
    });

    // ===== PAYMENT NOTIFICATIONS =====

    socket.on('payment:completed', (data) => {
      const { consultationId } = data;
      io.emit('notification:payment_received', { consultationId });
    });

    // ===== DISCONNECTION =====

    socket.on('disconnect', async () => {
      console.log(`❌ User disconnected: ${socket.userId}`);
      activeConnections.delete(socket.userId);
      
      // Broadcast user offline status
      io.emit('user:offline', { userId: socket.userId });
    });

    // ===== ERROR HANDLING =====

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  console.log('✅ Socket.IO initialized');
  return io;
};

// Helper function to emit to specific user
const notifyUser = (userId, event, data) => {
  const socketId = activeConnections.get(userId);
  if (socketId && io) {
    io.to(socketId).emit(event, data);
  }
};

// Helper function to emit to conversation
const notifyConversation = (conversationId, event, data) => {
  if (io) {
    io.to(conversationId).emit(event, data);
  }
};

module.exports = {
  initializeSocket,
  notifyUser,
  notifyConversation,
  getActiveConnections: () => activeConnections,
};
