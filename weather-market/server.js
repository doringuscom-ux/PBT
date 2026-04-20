const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const { startWidgetService, fetchWeatherForCoords } = require('./utils/widgetService');
const { startHeartbeat } = require('./utils/heartbeat');
const Widget = require('./models/Widget');

const app = express();
app.use(cors());
app.use(express.json());

const startServer = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully!');

        // Start background tasks
        startWidgetService();
        startHeartbeat();

        // API Endpoint for widgets
        app.get('/api/widgets', async (req, res) => {
            try {
                const { lat, lon } = req.query;
                const widgets = await Widget.find();
                
                let widgetData = widgets.reduce((acc, widget) => {
                    acc[widget.type] = widget.data;
                    return acc;
                }, {});

                if (lat && lon) {
                    const liveWeather = await fetchWeatherForCoords(lat, lon);
                    if (liveWeather) {
                        widgetData.weather = liveWeather;
                    }
                }
                res.json(widgetData);
            } catch (err) {
                res.status(500).json({ message: err.message });
            }
        });

        app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

        const PORT = process.env.PORT || 5001;
        app.listen(PORT, () => {
            console.log(`Weather & Market Service started on port ${PORT}`);
        });

    } catch (err) {
        console.error('Failed to start server:', err.message);
        process.exit(1);
    }
};

startServer();
