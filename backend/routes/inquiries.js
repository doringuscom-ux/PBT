const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const { appendToSheet } = require('../utils/googleSheetService');

// Helper to check admin
const isAdmin = (req, res, next) => {
    if (req.session.user && (req.session.user.role === 'admin' || req.session.user.role === 'sub-admin')) {
        next();
    } else {
        res.status(403).json({ message: 'Access denied' });
    }
};

// @route   POST /api/inquiries
// @desc    Submit a new inquiry (Public)
router.post('/', async (req, res) => {
    const { name, email, phone } = req.body;
    
    if (!name || !email || !phone) {
        return res.status(400).json({ message: 'Please provide name, email and phone' });
    }

    try {
        const inquiry = new Inquiry({ name, email, phone });
        await inquiry.save();
        
        // Sync to Google Sheets (Background)
        appendToSheet(inquiry);

        res.status(201).json({ success: true, message: 'Inquiry submitted successfully!' });
    } catch (err) {
        console.error('Inquiry Submission Error:', err);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
});

// @route   GET /api/inquiries
// @desc    Get all inquiries (Admin only)
router.get('/', isAdmin, async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 });
        res.json(inquiries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   DELETE /api/inquiries/:id
// @desc    Delete an inquiry (Admin only)
router.delete('/:id', isAdmin, async (req, res) => {
    try {
        const inquiry = await Inquiry.findById(req.params.id);
        if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
        
        await Inquiry.findByIdAndDelete(req.params.id);
        res.json({ message: 'Inquiry removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
