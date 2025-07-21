const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const http = require('http');              // ✅ Create HTTP server
const socketIo = require('socket.io');
const path = require('path');

// Create HTTP server manually
const server = http.createServer(app);

// Attach socket.io to server
const io = socketIo(server, {
  cors: {
    origin: '*', // Update to your frontend URL in production
    methods: ['GET', 'POST', 'DELETE']
  }
});

// Middleware to add io to every request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  'http://localhost:5173', // local Vite dev server
  'https://sri-ganesh-agencies.vercel.app', // your hosted frontend
];

const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // allow cookies, tokens, etc.
};

app.use(cors(corsOptions));



// Routers
const productRoutes = require('./api/routes/products'); 
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');
const home = require('./api/routes/home');
const cartRoutes = require('./api/routes/cart');

app.use('/products', productRoutes); 
app.use('/orders', orderRoutes);  // <== 'req.io' is available here
app.use('/user', userRoutes);
app.use('/cart', cartRoutes);

// Test route
app.get('/', (req, res) => {
  res.json("hello it is working");
});

// MongoDB connection
const dbURL = process.env.database_url;
mongoose.connect(dbURL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error);
  });

// Socket.io connection log
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // ✅ Add this: handle room join
  socket.on('join', ({ userId, isAdmin }) => {
    socket.join(userId.toString()); // Join a room specific to the user
    if (isAdmin) socket.join('admin'); // Join a room for admins
    console.log(`User ${userId} joined room. Admin: ${isAdmin}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Add this at the bottom of your file
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
