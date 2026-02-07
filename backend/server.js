require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');

// Initialize Express App
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    // origin: "http://localhost:8081", // Your frontend URL
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middlewares
app.use(cors());
app.use(express.json()); // for parsing application/json

// Inject io into req for all routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Import routes
const authRoutes = require('./routes/auth');
const statsRoutes = require('./routes/stats');
const issuesRoutes = require('./routes/issues');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/issues', issuesRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('HydroAid API is running...');
});

// Socket.IO Connection Handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join admin room for live statistics
  socket.on('join-admin', () => {
    socket.join('admin-room');
    console.log('Client joined admin room');
  });

  // Join department room for field updates
  socket.on('join-department', (departmentId) => {
    socket.join(`department-${departmentId}`);
    console.log(`Client joined department room: ${departmentId}`);
  });

  // Handle real-time donations
  socket.on('donation-made', (donationData) => {
    // Broadcast to admin room
    io.to('admin-room').emit('new-donation', donationData);
    // Broadcast to specific department if applicable
    if (donationData.departmentId) {
      io.to(`department-${donationData.departmentId}`).emit('department-donation', donationData);
    }
  });

  // Handle project updates
  socket.on('project-updated', (projectData) => {
    io.to('admin-room').emit('project-status-change', projectData);
    if (projectData.departmentId) {
      io.to(`department-${projectData.departmentId}`).emit('project-update', projectData);
    }
  });

  // Handle issue reports
  socket.on('issue-reported', (issueData) => {
    io.to('admin-room').emit('new-issue', issueData);
    if (issueData.departmentId) {
      io.to(`department-${issueData.departmentId}`).emit('department-issue', issueData);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Database Connection
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://dhannasruthi_db_user:uy6ya4q6E2RAkB9c@cluster0.96xwkl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Set JWT secret if not provided
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'hydroaid_jwt_secret_key_2024_secure_random_string';
}
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  server.listen(PORT, () => console.log(`Server running on port ${PORT}, and MongoDB connected successfully.`));
})
.catch(err => console.error('MongoDB connection error:', err)); 