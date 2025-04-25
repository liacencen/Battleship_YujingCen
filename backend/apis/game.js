const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Game = require('../db/game/game.model');
const User = require('../db/user/user.model');

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper function to verify token
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

// Game status constants
const GAME_STATUS = {
    OPEN: 'open',         // Waiting for second player
    ACTIVE: 'active',     // Game in progress
    COMPLETED: 'completed' // Game ended
};

// Create a new game
router.post('/', verifyToken, async (req, res) => {
    try {
        // Create a new game with random ship placements
        const newGame = new Game({
            createdBy: req.user.id,
            player1: {
                id: req.user.id,
                username: req.user.username,
                board: generateRandomBoard(),
                hits: Array(10).fill().map(() => Array(10).fill(false)),
                misses: Array(10).fill().map(() => Array(10).fill(false))
            },
            status: GAME_STATUS.OPEN,
            currentTurn: req.user.id,
            startTime: new Date()
        });

        await newGame.save();

        res.status(201).json({
            message: 'Game created successfully',
            gameId: newGame._id
        });
    } catch (error) {
        console.error('Create game error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Join a game
router.put('/:id/join', verifyToken, async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        if (game.status !== GAME_STATUS.OPEN) {
            return res.status(400).json({ message: 'Game is not open for joining' });
        }

        if (game.player1.id.toString() === req.user.id) {
            return res.status(400).json({ message: 'You cannot join your own game' });
        }

        // Update game with second player
        game.player2 = {
            id: req.user.id,
            username: req.user.username,
            board: generateRandomBoard(),
            hits: Array(10).fill().map(() => Array(10).fill(false)),
            misses: Array(10).fill().map(() => Array(10).fill(false))
        };
        game.status = GAME_STATUS.ACTIVE;

        await game.save();

        res.json({
            message: 'Joined game successfully',
            gameId: game._id
        });
    } catch (error) {
        console.error('Join game error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Make a move
router.put('/:id/move', verifyToken, async (req, res) => {
    try {
        const { row, col } = req.body;
        
        const game = await Game.findById(req.params.id);
        
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        if (game.status !== GAME_STATUS.ACTIVE) {
            return res.status(400).json({ message: 'Game is not active' });
        }

        if (game.currentTurn.toString() !== req.user.id) {
            return res.status(400).json({ message: 'Not your turn' });
        }

        // Determine which player is making the move
        const isPlayer1 = game.player1.id.toString() === req.user.id;
        const currentPlayer = isPlayer1 ? game.player1 : game.player2;
        const opponentPlayer = isPlayer1 ? game.player2 : game.player1;

        // Check if cell was already targeted
        if (currentPlayer.hits[row][col] || currentPlayer.misses[row][col]) {
            return res.status(400).json({ message: 'Cell already targeted' });
        }

        // Check if hit or miss
        const isHit = opponentPlayer.board[row][col] !== null;
        
        if (isHit) {
            currentPlayer.hits[row][col] = true;
        } else {
            currentPlayer.misses[row][col] = true;
        }

        // Check if all ships are hit (game over)
        let allShipsHit = true;
        for (let r = 0; r < 10; r++) {
            for (let c = 0; c < 10; c++) {
                if (opponentPlayer.board[r][c] !== null && !currentPlayer.hits[r][c]) {
                    allShipsHit = false;
                    break;
                }
            }
            if (!allShipsHit) break;
        }

        if (allShipsHit) {
            // Game over, current player wins
            game.status = GAME_STATUS.COMPLETED;
            game.winner = req.user.id;
            game.endTime = new Date();

            // Update player stats
            await User.findByIdAndUpdate(req.user.id, { $inc: { wins: 1 } });
            await User.findByIdAndUpdate(opponentPlayer.id, { $inc: { losses: 1 } });
        } else {
            // Switch turns
            game.currentTurn = opponentPlayer.id;
        }

        // Save updated game
        if (isPlayer1) {
            game.player1 = currentPlayer;
        } else {
            game.player2 = currentPlayer;
        }

        await game.save();

        res.json({
            message: isHit ? 'Hit!' : 'Miss!',
            gameOver: allShipsHit,
            winner: allShipsHit ? req.user.username : null
        });
    } catch (error) {
        console.error('Make move error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a specific game
router.get('/:id', async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        // If user is logged in, hide opponent's ships
        const token = req.cookies.token;
        let userId = null;
        
        if (token) {
            try {
                const decoded = jwt.verify(token, JWT_SECRET);
                userId = decoded.id;
            } catch (err) {
                console.error('Token verification error:', err);
            }
        }

        // Create a sanitized version of the game
        const sanitizedGame = {
            _id: game._id,
            status: game.status,
            currentTurn: game.currentTurn,
            startTime: game.startTime,
            endTime: game.endTime,
            winner: game.winner,
            player1: {
                id: game.player1.id,
                username: game.player1.username,
                hits: game.player1.hits,
                misses: game.player1.misses
            },
            player2: game.player2 ? {
                id: game.player2.id,
                username: game.player2.username,
                hits: game.player2.hits,
                misses: game.player2.misses
            } : null
        };

        // If user is logged in and part of the game, add their board
        if (userId) {
            if (game.player1.id.toString() === userId) {
                sanitizedGame.player1.board = game.player1.board;
            } else if (game.player2 && game.player2.id.toString() === userId) {
                sanitizedGame.player2.board = game.player2.board;
            }
        }

        // If game is completed, show all boards
        if (game.status === GAME_STATUS.COMPLETED) {
            sanitizedGame.player1.board = game.player1.board;
            if (game.player2) {
                sanitizedGame.player2.board = game.player2.board;
            }
        }

        res.json(sanitizedGame);
    } catch (error) {
        console.error('Get game error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all games
router.get('/', async (req, res) => {
    try {
        const allGames = await Game.find().sort({ startTime: -1 });
        
        // If user is logged in, mark user's games
        const token = req.cookies.token;
        let userId = null;
        
        if (token) {
            try {
                const decoded = jwt.verify(token, JWT_SECRET);
                userId = decoded.id;
            } catch (err) {
                console.error('Token verification error:', err);
            }
        }

        // Create sanitized game list
        const sanitizedGames = allGames.map(game => ({
            _id: game._id,
            status: game.status,
            startTime: game.startTime,
            endTime: game.endTime,
            winner: game.winner,
            player1: {
                id: game.player1.id,
                username: game.player1.username
            },
            player2: game.player2 ? {
                id: game.player2.id,
                username: game.player2.username
            } : null,
            isUserGame: userId ? 
                (game.player1.id.toString() === userId || 
                (game.player2 && game.player2.id.toString() === userId)) 
                : false
        }));

        res.json(sanitizedGames);
    } catch (error) {
        console.error('Get all games error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Challenge AI
router.put('/:id/challenge-ai', verifyToken, async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        if (game.status !== GAME_STATUS.OPEN) {
            return res.status(400).json({ message: 'Game is not open for AI challenge' });
        }

        if (game.player1.id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You can only add AI to your own game' });
        }

        // Update game with AI player
        game.player2 = {
            id: 'ai',
            username: 'Computer',
            board: generateRandomBoard(),
            hits: Array(10).fill().map(() => Array(10).fill(false)),
            misses: Array(10).fill().map(() => Array(10).fill(false))
        };
        game.status = GAME_STATUS.ACTIVE;
        game.isAIGame = true;

        await game.save();

        res.json({
            message: 'AI opponent added successfully',
            gameId: game._id
        });
    } catch (error) {
        console.error('Challenge AI error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Helper function to generate a random board with ships
function generateRandomBoard() {
    const board = Array(10).fill().map(() => Array(10).fill(null));
    
    // Ship sizes (Carrier: 5, Battleship: 4, Cruiser: 3, Submarine: 3, Destroyer: 2)
    const ships = [
        { id: 'carrier', size: 5 },
        { id: 'battleship', size: 4 },
        { id: 'cruiser', size: 3 },
        { id: 'submarine', size: 3 },
        { id: 'destroyer', size: 2 }
    ];

    for (const ship of ships) {
        let placed = false;
        
        while (!placed) {
            const horizontal = Math.random() < 0.5;
            const row = Math.floor(Math.random() * 10);
            const col = Math.floor(Math.random() * 10);
            
            // Check if ship fits on board
            if (horizontal) {
                if (col + ship.size > 10) continue;
            } else {
                if (row + ship.size > 10) continue;
            }
            
            // Check if ship overlaps with another ship
            let overlap = false;
            for (let i = 0; i < ship.size; i++) {
                const r = horizontal ? row : row + i;
                const c = horizontal ? col + i : col;
                
                if (board[r][c] !== null) {
                    overlap = true;
                    break;
                }
            }
            
            if (overlap) continue;
            
            // Place ship on board
            for (let i = 0; i < ship.size; i++) {
                const r = horizontal ? row : row + i;
                const c = horizontal ? col + i : col;
                
                board[r][c] = { 
                    id: ship.id,
                    index: i,
                    size: ship.size,
                    horizontal
                };
            }
            
            placed = true;
        }
    }
    
    return board;
}

// AI move
router.post('/:id/ai-move', verifyToken, async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        if (!game.isAIGame) {
            return res.status(400).json({ message: 'Not an AI game' });
        }

        if (game.status !== GAME_STATUS.ACTIVE) {
            return res.status(400).json({ message: 'Game is not active' });
        }

        if (game.currentTurn !== 'ai') {
            return res.status(400).json({ message: 'Not AI turn' });
        }

        // AI strategy: focus on cells adjacent to hits, otherwise random
        let row, col;
        let validMove = false;

        // Look for cells adjacent to hits
        const adjacentMoves = findAdjacentToHits(game.player2.hits, game.player2.misses);
        
        if (adjacentMoves.length > 0) {
            // Choose a random adjacent cell
            const randomIndex = Math.floor(Math.random() * adjacentMoves.length);
            [row, col] = adjacentMoves[randomIndex];
            validMove = true;
        } else {
            // Random move
            while (!validMove) {
                row = Math.floor(Math.random() * 10);
                col = Math.floor(Math.random() * 10);
                
                // Check if cell was already targeted
                if (!game.player2.hits[row][col] && !game.player2.misses[row][col]) {
                    validMove = true;
                }
            }
        }

        // Check if hit or miss
        const isHit = game.player1.board[row][col] !== null;
        
        if (isHit) {
            game.player2.hits[row][col] = true;
        } else {
            game.player2.misses[row][col] = true;
        }

        // Check if all ships are hit (game over)
        let allShipsHit = true;
        for (let r = 0; r < 10; r++) {
            for (let c = 0; c < 10; c++) {
                if (game.player1.board[r][c] !== null && !game.player2.hits[r][c]) {
                    allShipsHit = false;
                    break;
                }
            }
            if (!allShipsHit) break;
        }

        if (allShipsHit) {
            // Game over, AI wins
            game.status = GAME_STATUS.COMPLETED;
            game.winner = 'ai';
            game.endTime = new Date();

            // Update player stats (only for human)
            await User.findByIdAndUpdate(game.player1.id, { $inc: { losses: 1 } });
        } else {
            // Switch turns
            game.currentTurn = game.player1.id;
        }

        await game.save();

        res.json({
            message: isHit ? 'AI Hit!' : 'AI Miss!',
            row,
            col,
            isHit,
            gameOver: allShipsHit,
            winner: allShipsHit ? 'Computer' : null
        });
    } catch (error) {
        console.error('AI move error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Helper function to find cells adjacent to hits
function findAdjacentToHits(hits, misses) {
    const adjacentCells = [];
    
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
            if (hits[row][col]) {
                // Check adjacent cells (up, right, down, left)
                const directions = [
                    [-1, 0], [0, 1], [1, 0], [0, -1]
                ];
                
                for (const [dx, dy] of directions) {
                    const newRow = row + dx;
                    const newCol = col + dy;
                    
                    // Check if cell is valid and not already targeted
                    if (
                        newRow >= 0 && newRow < 10 &&
                        newCol >= 0 && newCol < 10 &&
                        !hits[newRow][newCol] &&
                        !misses[newRow][newCol]
                    ) {
                        adjacentCells.push([newRow, newCol]);
                    }
                }
            }
        }
    }
    
    return adjacentCells;
}

module.exports = router; 