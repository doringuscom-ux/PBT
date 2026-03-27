const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    coverImage: { type: String },
    rating: { type: Number, required: true },
    genre: { type: String, required: true },
    year: { type: Number, required: true },
    overview: { type: String },
    director: { type: String },
    runtime: { type: String },
    certification: { type: String },
    performance: {
        day1: { type: String },
        weekend: { type: String },
        status: { type: String }
    },
    industry: { type: String, default: 'Pollywood' },
    fullStory: { type: String },
    trailerUrl: { type: String },
    trailerVideo: { type: mongoose.Schema.Types.ObjectId, ref: 'Video' },
    releaseDate: { type: Date },
    likes: { type: Number, default: 0 },
    cast: [{
        name: { type: String, required: true },
        role: { type: String, required: true },
        image: { type: String },
        celebrity: { type: mongoose.Schema.Types.ObjectId, ref: 'Celebrity' }
    }],
    comments: [{
        user: { type: String, required: true },
        content: { type: String, required: true },
        likes: { type: Number, default: 0 },
        likedBy: [{ type: String }],
        reports: [{ type: String }],
        createdAt: { type: Date, default: Date.now }
    }],
    slug: { type: String, unique: true, sparse: true },
    userRatings: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, min: 1, max: 5 },
        createdAt: { type: Date, default: Date.now }
    }],
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    photos: [{ type: String }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Movie', MovieSchema);
