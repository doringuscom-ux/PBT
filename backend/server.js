const session = require('express-session');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const { startHeartbeat } = require('./utils/heartbeat');
require('dotenv').config();

const MongoStore = require('connect-mongo');
const app = express();

const startServer = async () => {
    try {
        // Connect Database
        await connectDB();
        startHeartbeat();

        // Init Middleware
        app.set('trust proxy', 1); // Trust first proxy (Render, Heroku, etc.)
        app.use(cors({
            origin: true,
            credentials: true
        }));
        app.use(express.json());

        // Session Middleware
        const store = (typeof MongoStore.create === 'function') 
            ? MongoStore.create({ mongoUrl: process.env.MONGO_URI, ttl: 14 * 24 * 60 * 60 })
            : MongoStore.default && typeof MongoStore.default.create === 'function'
                ? MongoStore.default.create({ mongoUrl: process.env.MONGO_URI, ttl: 14 * 24 * 60 * 60 })
                : new MongoStore({ mongoUrl: process.env.MONGO_URI, ttl: 14 * 24 * 60 * 60 });

        app.use(session({
            name: 'pbtadka.sid', // Custom name to avoid generic sid
            secret: process.env.SESSION_SECRET || 'punjabi-film-news-secret-123',
            resave: false,
            saveUninitialized: false,
            store: store,
            proxy: true, // Required for secure cookies behind proxies
            cookie: { 
                secure: process.env.NODE_ENV === 'production', 
                httpOnly: true,
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' for cross-site cookies in prod
                maxAge: 24 * 60 * 60 * 1000 
            }
        }));


        // Static folder for uploads
        app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

        app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
        app.use('/sitemap.xml', require('./routes/sitemap'));

        // Define Routes
        app.use('/api/auth', require('./routes/auth'));
        app.use('/api/movies', require('./routes/movies'));
        app.use('/api/news', require('./routes/news'));
        app.use('/api/celebrities', require('./routes/celebrities'));
        app.use('/api/videos', require('./routes/videos'));
        app.use('/api/users', require('./routes/users'));
        app.use('/api/subscribers', require('./routes/subscribers'));
        app.use('/api/inquiries', require('./routes/inquiries'));
        app.use('/api/seo', require('./routes/seo'));

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (err) {
        console.error('Failed to start server:', err.message);
        process.exit(1);
    }
};

startServer();
