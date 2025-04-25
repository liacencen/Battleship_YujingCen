const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    password: {
        type: String,
        required: true
    },
    wins: {
        type: Number,
        default: 0
    },
    losses: {
        type: Number,
        default: 0
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    loginCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Add virtual for win rate
userSchema.virtual('winRate').get(function() {
    const totalGames = this.wins + this.losses;
    if (totalGames === 0) return 0;
    return (this.wins / totalGames * 100).toFixed(1);
});

// Add method to get user stats
userSchema.methods.getStats = function() {
    return {
        username: this.username,
        wins: this.wins,
        losses: this.losses,
        winRate: this.winRate,
        totalGames: this.wins + this.losses,
        lastLogin: this.lastLogin,
        loginCount: this.loginCount
    };
};

module.exports = userSchema; 