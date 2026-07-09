const express = require('express');
const router = express.Router();
const Promotion = require('../models/Promotion');
const { upload } = require('../config/cloudinary');

// Get all active promotions (for frontend)
router.get('/', async (req, res) => {
    try {
        const isAdmin = req.session && req.session.user && (req.session.user.role === 'admin' || req.session.user.role === 'sub-admin');
        
        let query = {};
        if (!isAdmin) {
            query.isActive = true;
        }

        const promotions = await Promotion.find(query).sort({ order: 1, createdAt: -1 });
        res.json(promotions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new promotion
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const isAdmin = req.session && req.session.user && (req.session.user.role === 'admin' || req.session.user.role === 'sub-admin');
        if (!isAdmin) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const { title, link, isActive, order } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        // The multer-storage-cloudinary automatically handles uploading and populates req.file.path with the secure URL
        const imageUrl = req.file.path;

        const promotion = new Promotion({
            title,
            image: imageUrl,
            link: link || '',
            isActive: isActive === 'true' || isActive === true,
            order: order ? parseInt(order, 10) : 0,
            createdBy: req.session.user.id
        });

        const newPromotion = await promotion.save();
        res.status(201).json(newPromotion);
    } catch (err) {
        console.error("Error creating promotion:", err);
        res.status(400).json({ message: err.message });
    }
});

// Update a promotion
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const isAdmin = req.session && req.session.user && (req.session.user.role === 'admin' || req.session.user.role === 'sub-admin');
        if (!isAdmin) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const { title, link, isActive, order } = req.body;
        const updateData = {};
        
        if (title !== undefined) updateData.title = title;
        if (link !== undefined) updateData.link = link;
        if (isActive !== undefined) updateData.isActive = isActive === 'true' || isActive === true;
        if (order !== undefined) updateData.order = parseInt(order, 10);
        
        if (req.file) {
            updateData.image = req.file.path;
        }

        const updatedPromotion = await Promotion.findByIdAndUpdate(
            req.params.id, 
            updateData, 
            { new: true }
        );

        if (!updatedPromotion) {
            return res.status(404).json({ message: 'Promotion not found' });
        }

        res.json(updatedPromotion);
    } catch (err) {
        console.error("Error updating promotion:", err);
        res.status(400).json({ message: err.message });
    }
});

// Delete a promotion
router.delete('/:id', async (req, res) => {
    try {
        const isAdmin = req.session && req.session.user && (req.session.user.role === 'admin' || req.session.user.role === 'sub-admin');
        if (!isAdmin) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const promotion = await Promotion.findByIdAndDelete(req.params.id);
        if (!promotion) {
            return res.status(404).json({ message: 'Promotion not found' });
        }
        
        // Ideally we should also delete the image from Cloudinary here
        // but skipping for simplicity unless explicitly required.

        res.json({ message: 'Promotion deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
