const mongoose = require('mongoose');
const gameSchema = require('./game.schema');

const Game = mongoose.model('Game', gameSchema);

module.exports = Game; 