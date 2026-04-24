const express = require('express');
const router = express.Router();
const News = require('../models/News');
const Movie = require('../models/Movie');
const Celebrity = require('../models/Celebrity');
const Video = require('../models/Video');

const BASE_URL = process.env.FRONTEND_URL || 'https://pbtadka.com';

router.get('/', async (req, res) => {
    try {
        const [news, movies, celebs, videos] = await Promise.all([
            News.find({}, 'slug updatedAt'),
            Movie.find({}, 'slug updatedAt'),
            Celebrity.find({}, 'slug updatedAt'),
            Video.find({}, 'slug updatedAt')
        ]);

        const staticPages = [
            '',
            '/news',
            '/movies',
            '/celebs',
            '/videos',
            '/box-office',
            '/contact-us',
            '/today-news',
            '/upcoming',
            '/sports'
        ];

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        // Add static pages
        staticPages.forEach(page => {
            xml += `
  <url>
    <loc>${BASE_URL}${page}</loc>
    <changefreq>daily</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`;
        });

        // Add News
        news.forEach(item => {
            if (item.slug) {
                const url = `${BASE_URL}/news/${item.slug}`.toLowerCase().replace(/\/$/, '');
                xml += `
  <url>
    <loc>${url}</loc>
    <lastmod>${item.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
            }
        });

        // Add Movies
        movies.forEach(item => {
            if (item.slug) {
                const url = `${BASE_URL}/movie/${item.slug}`.toLowerCase().replace(/\/$/, '');
                xml += `
  <url>
    <loc>${url}</loc>
    <lastmod>${item.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
            }
        });

        // Add Celebs
        celebs.forEach(item => {
            if (item.slug) {
                const url = `${BASE_URL}/celeb/${item.slug}`.toLowerCase().replace(/\/$/, '');
                xml += `
  <url>
    <loc>${url}</loc>
    <lastmod>${item.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
            }
        });

        // Add Videos
        videos.forEach(item => {
            if (item.slug) {
                xml += `
  <url>
    <loc>${BASE_URL}/video/${item.slug}</loc>
    <lastmod>${item.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
            }
        });

        xml += `
</urlset>`;

        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (err) {
        console.error("Sitemap Error:", err);
        res.status(500).send("Error generating sitemap");
    }
});

module.exports = router;
