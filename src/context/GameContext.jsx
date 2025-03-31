import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

// Create context
export const GameContext = createContext();

// Ship configurations
const SHIPS = [
  { id: 'carrier', size: 5, name: 'Aircraft Carrier' },
  { id: 'battleship', size: 4, name: 'Battleship' },
  { id: 'cruiser', size: 3, name: 'Cruiser' },
  { id: 'submarine', size: 3, name: 'Submarine' },
  { id: 'destroyer', size: 2, name: 'Destroyer' }
];

// Create a function to generate initial state
const createInitialState = () => ({
  mode: null,
  playerBoard: Array(10).fill().map(() => Array(10).fill(null)),
  aiBoard: Array(10).fill().map(() => Array(10).fill(null)),
  playerShips: SHIPS.map(ship => ({ ...ship, placed: false, positions: [], hits: 0 })),
  aiShips: SHIPS.map(ship => ({ ...ship, placed: false, positions: [], hits: 0 })),
  gameStatus: 'setup',
  currentTurn: 'player',
  winner: null,
  timer: 0,
  playerMoves: [],
  aiMoves: [],
  currentShipToPlace: 0
});

// Utility functions
const isValidPlacement = (board, row, col, size, orientation) => {
  // Check if ship fits on board
  if (orientation === 'horizontal' && col + size > 10) return false;
  if (orientation === 'vertical' && row + size > 10) return false;
  
  // Check if position is occupied
  for (let i = 0; i < size; i++) {
    const checkRow = orientation === 'horizontal' ? row : row + i;
    const checkCol = orientation === 'horizontal' ? col + i : col;
    
    if (board[checkRow][checkCol] !== null) return false;
  }
  
  return true;
};

// Get random position for AI ships
const getRandomPosition = (board, shipSize) => {
  const orientation = Math.random() > 0.5 ? 'horizontal' : 'vertical';
  let row, col;
  let valid = false;
  
  while (!valid) {
    row = Math.floor(Math.random() * 10);
    col = Math.floor(Math.random() * 10);
    valid = isValidPlacement(board, row, col, shipSize, orientation);
  }
  
  return { row, col, orientation };
};

export const GameProvider = ({ children }) => {
  const location = useLocation();
  const [gameState, setGameState] = useState(() => {
    const savedState = localStorage.getItem('battleshipGame');
    return savedState ? JSON.parse(savedState) : createInitialState();
  });

  // Reset game state when navigating away from game pages
  useEffect(() => {
    if (!location.pathname.startsWith('/game/')) {
      localStorage.removeItem('battleshipGame');
      setGameState(createInitialState());
    }
  }, [location]);

  // Save to localStorage when state changes
  useEffect(() => {
    if (gameState.mode && gameState.gameStatus !== 'ended' && location.pathname.startsWith('/game/')) {
      localStorage.setItem('battleshipGame', JSON.stringify(gameState));
    }
  }, [gameState, location]);

  // Timer functionality
  useEffect(() => {
    let interval = null;
    if (gameState.gameStatus === 'playing' && location.pathname.startsWith('/game/')) {
      interval = setInterval(() => {
        setGameState(prev => ({ ...prev, timer: prev.timer + 1 }));
      }, 1000);
    }
    return () => interval && clearInterval(interval);
  }, [gameState.gameStatus, location]);

  // AI move logic
  useEffect(() => {
    if (gameState.gameStatus === 'playing' && 
        gameState.currentTurn === 'ai' && 
        !gameState.winner && 
        gameState.mode === 'normal' &&
        location.pathname.startsWith('/game/')) {
      const timeout = setTimeout(makeAiMove, 1000);
      return () => clearTimeout(timeout);
    }
  }, [gameState.currentTurn, gameState.gameStatus, location]);

  const resetGame = useCallback(() => {
    localStorage.removeItem('battleshipGame');
    setGameState(createInitialState());
  }, []);

  const setGameMode = useCallback((mode) => {
    if (!location.pathname.startsWith('/game/')) {
      return;
    }

    const newState = { ...createInitialState(), mode };
    
    if (mode === 'freeplay' || mode === 'normal') {
      const stateWithAiShips = placeAiShips(newState);
      if (mode === 'normal') {
        const finalState = placePlayerShipsAutomatically(stateWithAiShips);
        finalState.gameStatus = 'playing';
        setGameState(finalState);
      } else {
        setGameState(stateWithAiShips);
      }
    }
  }, [location.pathname]);

  const placeShip = (board, ships, row, col, ship, orientation) => {
    if (!isValidPlacement(board, row, col, ship.size, orientation)) {
      return null;
    }

    const newBoard = [...board];
    const positions = [];

    for (let i = 0; i < ship.size; i++) {
      const shipRow = orientation === 'horizontal' ? row : row + i;
      const shipCol = orientation === 'horizontal' ? col + i : col;
      newBoard[shipRow][shipCol] = 'ship';
      positions.push({ row: shipRow, col: shipCol });
    }

    const newShips = ships.map(s => 
      s.id === ship.id ? { ...s, placed: true, positions, orientation } : s
    );

    return { board: newBoard, ships: newShips };
  };

  const placePlayerShip = (row, col, orientation) => {
    const currentShip = gameState.playerShips.find(ship => !ship.placed);
    if (!currentShip) return;

    const result = placeShip(
      gameState.playerBoard,
      gameState.playerShips,
      row,
      col,
      currentShip,
      orientation
    );

    if (result) {
      const allShipsPlaced = result.ships.every(ship => ship.placed);
      setGameState(prev => ({
        ...prev,
        playerBoard: result.board,
        playerShips: result.ships,
        gameStatus: allShipsPlaced ? 'playing' : 'setup'
      }));
    }
  };

  const placeAiShips = (state) => {
    let newBoard = [...state.aiBoard];
    let newShips = [...state.aiShips];

    state.aiShips.forEach(ship => {
      let placed = false;
      while (!placed) {
        const orientation = Math.random() > 0.5 ? 'horizontal' : 'vertical';
        const row = Math.floor(Math.random() * 10);
        const col = Math.floor(Math.random() * 10);

        const result = placeShip(newBoard, newShips, row, col, ship, orientation);
        if (result) {
          newBoard = result.board;
          newShips = result.ships;
          placed = true;
        }
      }
    });

    return { ...state, aiBoard: newBoard, aiShips: newShips };
  };

  const placePlayerShipsAutomatically = (state) => {
    let newBoard = [...state.playerBoard];
    let newShips = [...state.playerShips];

    state.playerShips.forEach(ship => {
      let placed = false;
      while (!placed) {
        const orientation = Math.random() > 0.5 ? 'horizontal' : 'vertical';
        const row = Math.floor(Math.random() * 10);
        const col = Math.floor(Math.random() * 10);

        const result = placeShip(newBoard, newShips, row, col, ship, orientation);
        if (result) {
          newBoard = result.board;
          newShips = result.ships;
          placed = true;
        }
      }
    });

    return { ...state, playerBoard: newBoard, playerShips: newShips };
  };

  const playerMove = (row, col) => {
    if (gameState.gameStatus !== 'playing' || 
        gameState.currentTurn !== 'player' || 
        gameState.playerMoves.some(move => move.row === row && move.col === col)) {
      return;
    }

    const newAiBoard = [...gameState.aiBoard];
    const isHit = newAiBoard[row][col] === 'ship';
    newAiBoard[row][col] = isHit ? 'hit' : 'miss';

    const newAiShips = [...gameState.aiShips].map(ship => {
      if (ship.positions.some(pos => pos.row === row && pos.col === col)) {
        return { ...ship, hits: ship.hits + 1 };
      }
      return ship;
    });

    const newState = {
      ...gameState,
      aiBoard: newAiBoard,
      aiShips: newAiShips,
      playerMoves: [...gameState.playerMoves, { row, col, result: isHit ? 'hit' : 'miss' }],
      currentTurn: gameState.mode === 'normal' ? 'ai' : 'player'
    };

    const playerWon = newAiShips.every(ship => ship.hits === ship.size);
    if (playerWon) {
      newState.winner = 'player';
      newState.gameStatus = 'ended';
    }

    setGameState(newState);
  };

  const makeAiMove = () => {
    if (gameState.gameStatus !== 'playing' || gameState.currentTurn !== 'ai') {
      return;
    }

    let row, col;
    do {
      row = Math.floor(Math.random() * 10);
      col = Math.floor(Math.random() * 10);
    } while (gameState.aiMoves.some(move => move.row === row && move.col === col));

    const newPlayerBoard = [...gameState.playerBoard];
    const isHit = newPlayerBoard[row][col] === 'ship';
    newPlayerBoard[row][col] = isHit ? 'hit' : 'miss';

    const newPlayerShips = [...gameState.playerShips].map(ship => {
      if (ship.positions.some(pos => pos.row === row && pos.col === col)) {
        return { ...ship, hits: ship.hits + 1 };
      }
      return ship;
    });

    const newState = {
      ...gameState,
      playerBoard: newPlayerBoard,
      playerShips: newPlayerShips,
      aiMoves: [...gameState.aiMoves, { row, col, result: isHit ? 'hit' : 'miss' }],
      currentTurn: 'player'
    };

    const aiWon = newPlayerShips.every(ship => ship.hits === ship.size);
    if (aiWon) {
      newState.winner = 'ai';
      newState.gameStatus = 'ended';
    }

    setGameState(newState);
  };

  const getCurrentShip = () => {
    return gameState.playerShips.find(ship => !ship.placed);
  };

  return (
    <GameContext.Provider value={{
      gameState,
      setGameMode,
      resetGame,
      playerMove,
      placePlayerShip,
      getCurrentShip
    }}>
      {children}
    </GameContext.Provider>
  );
}; 