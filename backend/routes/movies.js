const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const { upload } = require('../config/cloudinary');

// Helper to enrich with isLiked status for comments
const enrich = (items, sessionUser) => {
    const userId = sessionUser ? sessionUser.id : null;
    return items.map(item => {
        const itemObj = item.toObject();
        if (itemObj.comments) {
            itemObj.comments = itemObj.comments.map(comment => ({
                ...comment,
                isLiked: userId && comment.likedBy ? comment.likedBy.includes(userId) : false
            }));
        }
        return itemObj;
    });
};

// Get all movies
router.get('/', async (req, res) => {
    try {
        const isAdmin = req.session.user && (req.session.user.role === 'admin' || req.session.user.role === 'sub-admin');
        let query = Movie.find();
        
        if (isAdmin) {
            query = query.populate('createdBy', 'username employeeId fullName');
        }
        
        const movies = await query.populate('cast.celebrity').sort({ createdAt: -1 });
        res.json(enrich(movies, req.session.user));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a movie
router.post('/', upload.single('image'), async (req, res) => {
    const movieData = { ...req.body };
    if (req.file) {
        movieData.image = req.file.path;
    }
    if (req.session.user) {
        movieData.createdBy = req.session.user.id;
    }

    // Parse JSON strings from FormData
    if (typeof movieData.performance === 'string') {
        try { movieData.performance = JSON.parse(movieData.performance); } catch (e) { console.error("Performance parse error:", e); }
    }
    if (typeof movieData.cast === 'string') {
        try { movieData.cast = JSON.parse(movieData.cast); } catch (e) { console.error("Cast parse error:", e); }
    }
    if (typeof movieData.photos === 'string') {
        try { movieData.photos = JSON.parse(movieData.photos); } catch (e) { console.error("Photos parse error:", e); }
    }

    const movie = new Movie(movieData);
    try {
        const newMessage = await movie.save();
        res.status(201).json(newMessage);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a movie
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.image = req.file.path;
        }
        if (req.session.user) {
            updateData.createdBy = req.session.user.id;
        }

        // Parse JSON strings from FormData
        if (typeof updateData.performance === 'string') {
            try { updateData.performance = JSON.parse(updateData.performance); } catch (e) { console.error("Performance parse error:", e); }
        }
        if (typeof updateData.cast === 'string') {
            try { updateData.cast = JSON.parse(updateData.cast); } catch (e) { console.error("Cast parse error:", e); }
        }
        if (typeof updateData.photos === 'string') {
            try { updateData.photos = JSON.parse(updateData.photos); } catch (e) { console.error("Photos parse error:", e); }
        }

        // Heal corrupted data (remove invalid string entries if passed)
        if (updateData.comments && !Array.isArray(updateData.comments)) {
            delete updateData.comments;
        }

        const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, updateData, { new: true })
            .populate('createdBy', 'username employeeId fullName')
            .populate('cast.celebrity');

        if (!updatedMovie) return res.status(404).json({ message: 'Movie not found' });
        res.json(enrich([updatedMovie], req.session.user)[0]);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a movie
router.delete('/:id', async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        res.json({ message: 'Movie deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Comment Routes
router.post('/:id/comments', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        
        const { user, content } = req.body;
        if (!user || !content) return res.status(400).json({ message: 'User and Content are required' });

        // Heal corrupted data (remove invalid string entries)
        if (movie.comments) {
            movie.comments = movie.comments.filter(c => c && typeof c === 'object' && c.user);
        }

        movie.comments.push({ user, content });
        const updatedMovie = await movie.save();
        res.status(201).json(enrich([updatedMovie], req.session.user)[0]);

    } catch (err) { res.status(400).json({ message: err.message }); }
});


router.delete('/:id/comments/:commentId', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        
        const comment = movie.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });
        
        const isAuthor = req.session.user && req.session.user.username === comment.user;
        const isAdmin = req.session.user && (req.session.user.role === 'admin' || req.session.user.role === 'sub-admin');
        
        if (!isAuthor && !isAdmin) {
            return res.status(403).json({ message: 'Unauthorized to delete this comment' });
        }

        movie.comments = movie.comments.filter(c => c._id.toString() !== req.params.commentId);
        await movie.save();
        res.json(enrich([movie], req.session.user)[0]);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/:id/comments/:commentId/like', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        
        const comment = movie.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        if (!req.session.user) return res.status(401).json({ message: 'Login required' });
        const userId = req.session.user.id;
        
        if (!comment.likedBy) comment.likedBy = [];
        if (comment.likedBy.includes(userId)) {
            comment.likedBy = comment.likedBy.filter(id => id !== userId);
            comment.likes = Math.max(0, (comment.likes || 1) - 1);
        } else {
            comment.likedBy.push(userId);
            comment.likes = (comment.likes || 0) + 1;
        }
        await movie.save();
        res.json(enrich([movie], req.session.user)[0]);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id/comments/:commentId', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        
        const comment = movie.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        const isAuthor = req.session.user && req.session.user.username === comment.user;
        const isAdmin = req.session.user && (req.session.user.role === 'admin' || req.session.user.role === 'sub-admin');
        
        // If updating content, only author can do it
        if (req.body.content !== undefined && !isAuthor) {
             return res.status(403).json({ message: 'Only the author can edit comment content' });
        }
        
        // If updating likes (admin override), only admin can do it
        if (req.body.likes !== undefined && !isAdmin) {
             return res.status(403).json({ message: 'Only admins can override likes' });
        }

        if (req.body.likes !== undefined) comment.likes = req.body.likes;
        if (req.body.content !== undefined) comment.content = req.body.content;
        
        await movie.save();
        res.json(enrich([movie], req.session.user)[0]);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
