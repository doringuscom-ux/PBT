const express = require('express');
const router = express.Router();
const News = require('../models/News');
const { upload } = require('../config/cloudinary');

// Helper to enrich news with isLiked status for comments
const enrichNews = (articles, sessionUser) => {
    if (!articles) return [];
    const userId = sessionUser ? sessionUser.id : null;
    
    return articles.map(article => {
        if (!article) return null;
        const articleObj = typeof article.toObject === 'function' ? article.toObject() : article;
        
        // Ensure comments is an array
        if (articleObj.comments && Array.isArray(articleObj.comments)) {
            articleObj.comments = articleObj.comments.map(comment => ({
                ...comment,
                isLiked: userId && comment.likedBy ? comment.likedBy.includes(userId) : false
            }));
        } else {
            articleObj.comments = [];
        }
        
        return articleObj;
    }).filter(Boolean);
};

router.get('/', async (req, res) => {
    try {
        const isAdmin = req.session.user && (req.session.user.role === 'admin' || req.session.user.role === 'sub-admin');
        let query = News.find();
        
        if (isAdmin) {
            query = query.populate('createdBy', 'username employeeId fullName');
        }
        
        const news = await query.sort({ createdAt: -1 });
        res.json(enrichNews(news, req.session.user));
    } catch (err) {
        console.error("News GET Error:", err);
        res.status(500).json({ message: err.message });
    }
});

// Get Today's News
router.get('/today', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const isAdmin = req.session.user && (req.session.user.role === 'admin' || req.session.user.role === 'sub-admin');
        let query = News.find({
            createdAt: {
                $gte: today
            }
        });

        if (isAdmin) {
            query = query.populate('createdBy', 'username employeeId fullName');
        }

        const news = await query.sort({ createdAt: -1 }); 
        res.json(enrichNews(news, req.session.user));
    } catch (err) {
        console.error("News Today GET Error:", err);
        res.status(500).json({ message: err.message });
    }
});

router.post('/', (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error("News POST Multer Error:", err);
            return res.status(500).json({ message: "Image upload failed: " + (err.message || "Unknown error") });
        }
        next();
    });
}, async (req, res) => {
    try {
        const newsData = { ...req.body };
        if (req.file) {
            newsData.image = req.file.path;
        }
        if (req.session.user) {
            newsData.createdBy = req.session.user.id;
        }
        const news = new News(newsData);
        const newNews = await news.save();
        res.status(201).json(newNews);
    } catch (err) {
        console.error("News POST Error:", err);
        res.status(400).json({ message: err.message });
    }
});

// Update News
router.put('/:id', (req, res, next) => {
    // Custom wrapper for multer to catch 500s from Cloudinary
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error("Multer/Cloudinary Upload Error:", err);
            return res.status(500).json({ 
                message: "Image upload failed: " + (err.message || "Unknown error"),
                details: err
            });
        }
        next();
    });
}, async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.image = req.file.path;
        }
        if (req.session.user) {
            updateData.createdBy = req.session.user.id;
        }

        // Heal corrupted data (remove invalid string entries if passed)
        if (updateData.comments && !Array.isArray(updateData.comments)) {
            delete updateData.comments;
        }

        const updatedNews = await News.findByIdAndUpdate(req.params.id, updateData, { returnDocument: 'after' })
            .populate('createdBy', 'username employeeId fullName');

        if (!updatedNews) return res.status(404).json({ message: 'Article not found' });
        res.json(enrichNews([updatedNews], req.session.user)[0]);
    } catch (err) {
        console.error("News PUT Error (Final):", err);
        res.status(400).json({ message: err.message });
    }
});

// Delete News
router.delete('/:id', async (req, res) => {
    try {
        const news = await News.findByIdAndDelete(req.params.id);
        if (!news) return res.status(404).json({ message: 'Article not found' });
        res.json({ message: 'Article deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add comment
router.post('/:id/comments', async (req, res) => {
    try {
        const article = await News.findById(req.params.id);
        if (!article) return res.status(404).json({ message: 'Article not found' });
        
        const { user, content } = req.body;
        if (!user || !content) {
            return res.status(400).json({ message: 'User and Content are required' });
        }

        // Heal corrupted data (remove invalid string entries)
        if (article.comments) {
            article.comments = article.comments.filter(c => c && typeof c === 'object' && c.user);
        }

        article.comments.push({ user, content });
        const updatedArticle = await article.save();
        res.status(201).json(enrichNews([updatedArticle], req.session.user)[0]);
    } catch (err) {
        console.error("Comment Post Error Full:", err);
        res.status(400).json({ message: err.message });
    }
});


// Delete comment
router.delete('/:id/comments/:commentId', async (req, res) => {
    try {
        const article = await News.findById(req.params.id);
        if (!article) return res.status(404).json({ message: 'Article not found' });
        
        const comment = article.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        const isAuthor = req.session.user && req.session.user.username === comment.user;
        const isAdmin = req.session.user && (req.session.user.role === 'admin' || req.session.user.role === 'sub-admin');
        
        if (!isAuthor && !isAdmin) {
            return res.status(403).json({ message: 'Unauthorized to delete this comment' });
        }

        article.comments = article.comments.filter(c => c._id.toString() !== req.params.commentId);
        const updatedArticle = await article.save();
        res.json(enrichNews([updatedArticle], req.session.user)[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Like a comment (Toggle like)
router.post('/:id/comments/:commentId/like', async (req, res) => {
    try {
        const article = await News.findById(req.params.id);
        if (!article) return res.status(404).json({ message: 'Article not found' });
        
        const comment = article.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });
        
        if (!req.session.user) return res.status(401).json({ message: 'Login required' });
        const likerId = req.session.user.id; 

        if (!comment.likedBy) comment.likedBy = [];
        if (comment.likedBy.includes(likerId)) {
            // Already liked, so unlike
            comment.likedBy = comment.likedBy.filter(id => id !== likerId);
            comment.likes = Math.max(0, (parseInt(comment.likes) || 1) - 1);
        } else {
            // New like
            comment.likedBy.push(likerId);
            comment.likes = (parseInt(comment.likes) || 0) + 1;
        }
        
        await article.save();
        res.json(enrichNews([article], req.session.user)[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update Comment (Author edit or Admin manual like counts etc)
router.put('/:id/comments/:commentId', async (req, res) => {
    try {
        const article = await News.findById(req.params.id);
        if (!article) return res.status(404).json({ message: 'Article not found' });
        
        const comment = article.comments.id(req.params.commentId);
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
        
        await article.save();
        res.json(enrichNews([article], req.session.user)[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Report a comment
router.post('/:id/comments/:commentId/report', async (req, res) => {
    try {
        const article = await News.findById(req.params.id);
        if (!article) return res.status(404).json({ message: 'Article not found' });
        
        const comment = article.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });
        
        if (!req.session.user) return res.status(401).json({ message: 'Login required' });
        const reporterId = req.session.user.id; 

        if (!comment.reports) comment.reports = [];
        if (!comment.reports.includes(reporterId)) {
            comment.reports.push(reporterId);
            
            // Auto-delete if reports reach 5+
            if (comment.reports.length >= 5) {
                article.comments = article.comments.filter(c => c._id.toString() !== req.params.commentId);
            }
            
            await article.save();
        }
        res.json(enrichNews([article], req.session.user)[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
