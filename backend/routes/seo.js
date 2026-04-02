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

// Auto-generate SEO records for all content
router.post('/auto-generate', async (req, res) => {
    try {
        const [news, movies, celebs, videos] = await Promise.all([
            News.find({}, 'title slug excerpt fullStory'),
            Movie.find({}, 'title slug description'),
            Celebrity.find({}, 'name slug bio'),
            Video.find({}, 'title slug description')
        ]);

        let createdCount = 0;
        const staticPages = [
            { url: '/', title: 'Pbtadka | Latest Punjabi News, Movies & Celebrity Updates', description: 'Your premier destination for Punjabi cinema news, reviews, trailers, and celebrity interviews.' },
            { url: '/news', title: 'Latest Punjabi News & Headlines | Pbtadka', description: 'Stay updated with the latest breaking news from the Punjabi film industry.' },
            { url: '/movies', title: 'Punjabi Movies Vault | Reviews & Releases | Pbtadka', description: 'Explore our complete database of Punjabi movies, reviews, and release dates.' },
            { url: '/celebs', title: 'Punjabi Celebrities Profiles & Interviews | Pbtadka', description: 'Detailed profiles and exclusive interviews with your favorite Punjabi stars.' },
            { url: '/videos', title: 'Latest Punjabi Movie Trailers & Videos | Pbtadka', description: 'Watch the latest trailers, teasers, and exclusive video content from Pollywood.' },
            { url: '/upcoming', title: 'Upcoming Punjabi Movies & Releases | Pbtadka', description: 'Plan your cinema visits with our list of upcoming Punjabi movie releases.' },
            { url: '/sports', title: 'Punjabi Sports News & Updates | Pbtadka', description: 'Latest updates and actions from the world of Punjabi sports.' },
            { url: '/contact-us', title: 'Contact Us | Pbtadka', description: 'Get in touch with the Pbtadka team for inquiries and feedback.' },
            { url: '/box-office', title: 'Punjabi Box Office Collections & Reports | Pbtadka', description: 'Track the latest box office performance of Punjabi movies.' }
        ];

        // Process Static Pages
        for (const page of staticPages) {
            const exists = await SEO.findOne({ url: page.url });
            if (!exists) {
                await SEO.create({ ...page, isAuto: true });
                createdCount++;
            }
        }

        // Process News
        for (const item of news) {
            const url = `/news/${item.slug || item._id}`.toLowerCase();
            const exists = await SEO.findOne({ url });
            if (!exists) {
                await SEO.create({
                    url,
                    title: `${item.title} | Punjabi News | Pbtadka`,
                    description: (item.excerpt || item.fullStory || '').substring(0, 160).trim(),
                    isAuto: true
                });
                createdCount++;
            }
        }

        // Process Movies
        for (const item of movies) {
            const url = `/movie/${item.slug || item._id}`.toLowerCase();
            const exists = await SEO.findOne({ url });
            if (!exists) {
                await SEO.create({
                    url,
                    title: `${item.title} | Movie Details & Reviews | Pbtadka`,
                    description: (item.description || '').substring(0, 160).trim(),
                    isAuto: true
                });
                createdCount++;
            }
        }

        // Process Celebs
        for (const item of celebs) {
            const url = `/celeb/${item.slug || item._id}`.toLowerCase();
            const exists = await SEO.findOne({ url });
            if (!exists) {
                await SEO.create({
                    url,
                    title: `${item.name} | Celebrity Profile | Pbtadka`,
                    description: (item.bio || '').substring(0, 160).trim(),
                    isAuto: true
                });
                createdCount++;
            }
        }

        // Process Videos
        for (const item of videos) {
            const url = `/video/${item.slug || item._id}`.toLowerCase();
            const exists = await SEO.findOne({ url });
            if (!exists) {
                await SEO.create({
                    url,
                    title: `${item.title} | Watch Trailer & Videos | Pbtadka`,
                    description: (item.description || '').substring(0, 160).trim(),
                    isAuto: true
                });
                createdCount++;
            }
        }

        res.json({ success: true, message: `Successfully generated ${createdCount} new SEO records.`, createdCount });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
