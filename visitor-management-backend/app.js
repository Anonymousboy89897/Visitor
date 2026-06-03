require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorMiddleware = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const visitorRoutes = require('./routes/visitorRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/visitors', visitorRoutes);

// Error Middleware
app.use(errorMiddleware);

module.exports = app;
