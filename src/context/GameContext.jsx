import React, { createContext, useState, useEffect } from 'react';

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

// Initial game state
const initialState = {
  mode: null, // 'normal' or 'freeplay'
  playerBoard: Array(10).fill().map(() => Array(10).fill(null)),
  aiBoard: Array(10).fill().map(() => Array(10).fill(null)),
  playerShips: SHIPS.map(ship => ({ ...ship, placed: false, positions: [] })),
  aiShips: SHIPS.map(ship => ({ ...ship, placed: false, positions: [] })),
  gameStatus: 'setup', // 'setup', 'playing', 'ended'
  currentTurn: 'player',
  winner: null,
  timer: 0,
  playerMoves: [],
  aiMoves: [],
  currentShipToPlace: 0,
  draggedShip: null
};

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
  // Load from localStorage or use initialState
  const [gameState, setGameState] = useState(() => {
    const savedState = localStorage.getItem('battleshipGame');
    return savedState ? JSON.parse(savedState) : initialState;
  });

  // Save to localStorage when state changes
  useEffect(() => {
    // Only save game state if it's not initial state and game has started
    if (gameState.mode) {
      // Don't save to localStorage if the game has ended
      if (gameState.gameStatus === 'ended') {
        console.log("Game ended, removing from localStorage");
        localStorage.removeItem('battleshipGame');
      } else {
        console.log("Saving game state to localStorage:", gameState.mode, gameState.gameStatus);
        localStorage.setItem('battleshipGame', JSON.stringify(gameState));
      }
    }
  }, [gameState]);

  // Timer functionality
  useEffect(() => {
    let interval = null;
    
    if (gameState.gameStatus === 'playing') {
      interval = setInterval(() => {
        setGameState(prevState => ({
          ...prevState,
          timer: prevState.timer + 1
        }));
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState.gameStatus]);

  // AI move after player's turn
  useEffect(() => {
    let timeout = null;
    
    if (gameState.gameStatus === 'playing' && gameState.currentTurn === 'ai' && !gameState.winner) {
      timeout = setTimeout(() => {
        makeAiMove();
      }, 1000);
    }
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [gameState.currentTurn, gameState.gameStatus, gameState.winner]);

  // Reset game
  const resetGame = () => {
    console.log("Resetting game and clearing localStorage");
    localStorage.removeItem('battleshipGame');
    setGameState(initialState);
  };

  // Set game mode
  const setGameMode = (mode) => {
    console.log("Setting game mode to:", mode);
    setGameState(prevState => {
      // Create new game state with selected mode
      const newState = {
        ...initialState,
        mode
      };
      console.log("New state created:", newState);
      
      // If mode is freeplay, auto-place AI ships
      if (mode === 'freeplay') {
        const stateWithAiShips = placeAiShips(newState);
        console.log("State with AI ships:", stateWithAiShips);
        return stateWithAiShips;
      }
      
      // If mode is normal, auto-place all ships
      if (mode === 'normal') {
        const stateWithAiShips = placeAiShips(newState);
        const finalState = placePlayerShipsAutomatically(stateWithAiShips);
        console.log("Final state with all ships:", finalState);
        return finalState;
      }
      
      return newState;
    });
  };

  // Place AI ships randomly
  const placeAiShips = (state) => {
    const newState = { ...state };
    const newBoard = JSON.parse(JSON.stringify(newState.aiBoard));
    const newAiShips = [...newState.aiShips];
    
    newAiShips.forEach((ship, index) => {
      const { row, col, orientation } = getRandomPosition(newBoard, ship.size);
      const positions = [];
      
      // Place ship on board
      for (let i = 0; i < ship.size; i++) {
        const shipRow = orientation === 'horizontal' ? row : row + i;
        const shipCol = orientation === 'horizontal' ? col + i : col;
        
        newBoard[shipRow][shipCol] = 'ship';
        positions.push({ row: shipRow, col: shipCol });
      }
      
      newAiShips[index] = {
        ...ship,
        placed: true,
        positions,
        orientation
      };
    });
    
    return {
      ...newState,
      aiBoard: newBoard,
      aiShips: newAiShips
    };
  };

  // Auto-place player ships for normal mode
  const placePlayerShipsAutomatically = (state) => {
    const newState = { ...state };
    const newBoard = JSON.parse(JSON.stringify(newState.playerBoard));
    const newPlayerShips = [...newState.playerShips];
    
    newPlayerShips.forEach((ship, index) => {
      const { row, col, orientation } = getRandomPosition(newBoard, ship.size);
      const positions = [];
      
      // Place ship on board
      for (let i = 0; i < ship.size; i++) {
        const shipRow = orientation === 'horizontal' ? row : row + i;
        const shipCol = orientation === 'horizontal' ? col + i : col;
        
        newBoard[shipRow][shipCol] = 'ship';
        positions.push({ row: shipRow, col: shipCol });
      }
      
      newPlayerShips[index] = {
        ...ship,
        placed: true,
        positions,
        orientation
      };
    });
    
    return {
      ...newState,
      playerBoard: newBoard,
      playerShips: newPlayerShips,
      gameStatus: 'playing'
    };
  };

  // Start dragging a ship
  const startDraggingShip = (shipId) => {
    const shipIndex = gameState.playerShips.findIndex(ship => ship.id === shipId);
    if (shipIndex === -1) return;
    
    setGameState(prevState => ({
      ...prevState,
      draggedShip: shipIndex
    }));
  };

  // Stop dragging a ship
  const stopDraggingShip = () => {
    setGameState(prevState => ({
      ...prevState,
      draggedShip: null
    }));
  };

  // Place player ships manually for freeplay mode
  const placePlayerShip = (row, col, orientation) => {
    if (gameState.gameStatus !== 'setup') return;
    
    const currentShipIndex = gameState.currentShipToPlace;
    if (currentShipIndex >= gameState.playerShips.length) return;
    
    const ship = gameState.playerShips[currentShipIndex];
    const newBoard = JSON.parse(JSON.stringify(gameState.playerBoard));
    
    // Check if placement is valid
    if (!isValidPlacement(newBoard, row, col, ship.size, orientation)) return;
    
    const positions = [];
    
    // Place ship on board
    for (let i = 0; i < ship.size; i++) {
      const shipRow = orientation === 'horizontal' ? row : row + i;
      const shipCol = orientation === 'horizontal' ? col + i : col;
      
      newBoard[shipRow][shipCol] = 'ship';
      positions.push({ row: shipRow, col: shipCol });
    }
    
    const newPlayerShips = [...gameState.playerShips];
    newPlayerShips[currentShipIndex] = {
      ...ship,
      placed: true,
      positions,
      orientation
    };
    
    // Check if all ships are placed
    const allShipsPlaced = currentShipIndex === gameState.playerShips.length - 1;
    
    setGameState(prevState => ({
      ...prevState,
      playerBoard: newBoard,
      playerShips: newPlayerShips,
      currentShipToPlace: currentShipIndex + 1,
      gameStatus: allShipsPlaced ? 'playing' : 'setup'
    }));
  };

  // Start game
  const startGame = () => {
    setGameState(prevState => ({
      ...prevState,
      gameStatus: 'playing'
    }));
  };

  // Player move
  const playerMove = (row, col) => {
    if (
      gameState.gameStatus !== 'playing' || 
      gameState.currentTurn !== 'player' || 
      gameState.aiBoard[row][col] === 'hit' || 
      gameState.aiBoard[row][col] === 'miss'
    ) {
      return;
    }
    
    const newAiBoard = JSON.parse(JSON.stringify(gameState.aiBoard));
    const isHit = newAiBoard[row][col] === 'ship';
    
    newAiBoard[row][col] = isHit ? 'hit' : 'miss';
    
    const newPlayerMoves = [...gameState.playerMoves, { row, col, result: isHit ? 'hit' : 'miss' }];
    
    // Check if player won
    const playerWon = checkForWin(newAiBoard, gameState.aiShips);
    
    setGameState(prevState => ({
      ...prevState,
      aiBoard: newAiBoard,
      playerMoves: newPlayerMoves,
      currentTurn: playerWon ? 'player' : 'ai',
      winner: playerWon ? 'player' : null,
      gameStatus: playerWon ? 'ended' : 'playing'
    }));
  };

  // AI move
  const makeAiMove = () => {
    if (gameState.gameStatus !== 'playing' || gameState.currentTurn !== 'ai') {
      return;
    }
    
    const newPlayerBoard = JSON.parse(JSON.stringify(gameState.playerBoard));
    
    // Get a random unplayed position
    let row, col;
    do {
      row = Math.floor(Math.random() * 10);
      col = Math.floor(Math.random() * 10);
    } while (
      newPlayerBoard[row][col] === 'hit' || 
      newPlayerBoard[row][col] === 'miss'
    );
    
    const isHit = newPlayerBoard[row][col] === 'ship';
    
    newPlayerBoard[row][col] = isHit ? 'hit' : 'miss';
    
    const newAiMoves = [...gameState.aiMoves, { row, col, result: isHit ? 'hit' : 'miss' }];
    
    // Check if AI won
    const aiWon = checkForWin(newPlayerBoard, gameState.playerShips);
    
    setGameState(prevState => ({
      ...prevState,
      playerBoard: newPlayerBoard,
      aiMoves: newAiMoves,
      currentTurn: aiWon ? 'ai' : 'player',
      winner: aiWon ? 'ai' : null,
      gameStatus: aiWon ? 'ended' : 'playing'
    }));
  };

  // Check if a player has won
  const checkForWin = (board, ships) => {
    // A player wins when all opponent's ships are hit
    for (const ship of ships) {
      let allPositionsHit = true;
      
      for (const position of ship.positions) {
        if (board[position.row][position.col] !== 'hit') {
          allPositionsHit = false;
          break;
        }
      }
      
      if (!allPositionsHit) return false;
    }
    
    return true;
  };

  // Get current ship to place
  const getCurrentShip = () => {
    return gameState.playerShips[gameState.currentShipToPlace] || null;
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        resetGame,
        setGameMode,
        startGame,
        playerMove,
        placePlayerShip,
        getCurrentShip,
        startDraggingShip,
        stopDraggingShip
      }}
    >
      {children}
    </GameContext.Provider>
  );
}; 