const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: {
        type: String,
        required: true
    },
    board: {
        type: [[Object]],
        required: true
    },
    hits: {
        type: [[Boolean]],
        required: true
    },
    misses: {
        type: [[Boolean]],
        required: true
    }
}, { _id: false });

const aiPlayerSchema = new mongoose.Schema({
    id: {
        type: String,
        default: 'ai'
    },
    username: {
        type: String,
        default: 'Computer'
    },
    board: {
        type: [[Object]],
        required: true
    },
    hits: {
        type: [[Boolean]],
        required: true
    },
    misses: {
        type: [[Boolean]],
        required: true
    }
}, { _id: false });

const gameSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    player1: {
        type: playerSchema,
        required: true
    },
    player2: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    status: {
        type: String,
        enum: ['open', 'active', 'completed'],
        default: 'open'
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: {
        type: Date,
        default: null
    },
    winner: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    currentTurn: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    isAIGame: {
        type: Boolean,
        default: false
    }
});

module.exports = gameSchema; 