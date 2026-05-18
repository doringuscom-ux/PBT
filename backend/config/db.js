const mongoose = require('mongoose');
require('dotenv').config();

// Prevent background connection errors from crashing the process
mongoose.connection.on('error', err => {
    console.error('[Mongoose] Background connection error:', err.message);
});

let isConnected = false;

const connectDB = async () => {
    if (isConnected || mongoose.connection.readyState === 1) {
        console.log('MongoDB is already connected.');
        return;
    }

    try {
        console.log('Connecting to MongoDB...');
        if (!process.env.MONGO_URI) {
            console.error('[Database] MONGO_URI is not set in environment variables.');
            if (process.env.VERCEL) {
                return; // Let Mongoose fail gracefully on requests instead of crashing server startup
            }
            process.exit(1);
        }
        await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;
        console.log('MongoDB connected successfully!');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        console.error('Stack trace:', err.stack);
        if (!process.env.VERCEL) {
            process.exit(1);
        }
    }
};

module.exports = connectDB;

