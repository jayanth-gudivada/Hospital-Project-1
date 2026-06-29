const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./db/connect');
const authRoutes = require('./routes/auth');
const hospitalRoutes = require('./routes/hospitals');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3094;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// REST API
app.use('/api/auth', authRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/users', userRoutes);

// 404 fallback for unknown API routes
app.use('/api', (req, res) => res.status(404).json({ msg: 'Not found' }));

// Serve the built React SPA (client/dist) in production. The client uses a
// relative '/api' base URL, so hosting both from the same origin needs no extra
// config. Any non-/api route falls back to index.html for client-side routing.
const clientDist = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist));
app.get('*', (req, res) => res.sendFile(path.join(clientDist, 'index.html')));

const start = async () => {
    try {
        if (!process.env.MONGO_URI) throw new Error('MONGO_URI is not set in server/.env');
        if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not set in server/.env');
        await connectDB(process.env.MONGO_URI);
        app.listen(PORT, () => console.log('API server running on port ' + PORT));
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
};

start();
