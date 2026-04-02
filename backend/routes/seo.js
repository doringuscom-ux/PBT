const express = require('express');
const router = express.Router();
const SEO = require('../models/SEO');
const News = require('../models/News');
const Movie = require('../models/Movie');
const Celebrity = require('../models/Celebrity');
const Video = require('../models/Video');

// Get all SEO records
router.get('/', async (req, res) => {
    try {
        const seoEntries = await SEO.find().sort({ updatedAt: -1 });
        res.json(seoEntries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get SEO stats
router.get('/stats', async (req, res) => {
    try {
        const [news, movies, celebs, videos, seoCount] = await Promise.all([
            News.countDocuments(),
            Movie.countDocuments(),
            Celebrity.countDocuments(),
            Video.countDocuments(),
            SEO.countDocuments()
        ]);

        const staticPagesCount = 10; // Approx static pages
        const totalPages = news + movies + celebs + videos + staticPagesCount;
        
        res.json({
            totalPages,
            seoCompleted: seoCount,
            seoMissing: Math.max(0, totalPages - seoCount)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get SEO for a specific URL
router.get('/metadata', async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).json({ message: 'URL is required' });
        
        const entry = await SEO.findOne({ url: url.toLowerCase() });
        if (!entry) return res.status(404).json({ message: 'SEO not found' });
        
        res.json(entry);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create or Update SEO record
router.post('/', async (req, res) => {
    try {
        const { url, title, description, keywords, canonical, robots, isAuto } = req.body;
        if (!url) return res.status(400).json({ message: 'URL is required' });

        // Block Admin pages from SEO
        if (url.toLowerCase().startsWith('/admin')) {
            return res.status(400).json({ message: 'Cannot create SEO entries for Admin pages.' });
        }

        const updatedSEO = await SEO.findOneAndUpdate(
            { url: url.toLowerCase() },
            { title, description, keywords, canonical, robots, isAuto },
            { new: true, upsert: true }
        );

        res.json(updatedSEO);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete SEO record
router.delete('/:id', async (req, res) => {
    try {
        const entry = await SEO.findByIdAndDelete(req.params.id);
        if (!entry) return res.status(404).json({ message: 'SEO record not found' });
        res.json({ message: 'SEO record deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
