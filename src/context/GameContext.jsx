import React, { createContext, useState, useEffect } from 'react';

// Create context
export const GameContext = createContext();

// Initial game state
const initialState = {
  mode: null, // 'normal' or 'easy'
  playerBoard: Array(10).fill().map(() => Array(10).fill(null)),
  aiBoard: Array(10).fill().map(() => Array(10).fill(null)),
  ships: [
    { id: 'carrier', size: 5, placed: false },
    { id: 'battleship', size: 4, placed: false },
    { id: 'cruiser1', size: 3, placed: false },
    { id: 'cruiser2', size: 3, placed: false },
    { id: 'destroyer', size: 2, placed: false }
  ],
  gameStatus: 'setup', // 'setup', 'playing', 'ended'
  currentTurn: 'player',
  winner: null,
  timer: 0
};

export const GameProvider = ({ children }) => {
  // Load from localStorage or use initialState
  const [gameState, setGameState] = useState(() => {
    const savedState = localStorage.getItem('battleshipGame');
    return savedState ? JSON.parse(savedState) : initialState;
  });

  // Save to localStorage when state changes
  useEffect(() => {
    if (gameState.gameStatus !== 'ended') {
      localStorage.setItem('battleshipGame', JSON.stringify(gameState));
    } else {
      localStorage.removeItem('battleshipGame');
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

  // Reset game
  const resetGame = () => {
    setGameState(initialState);
    localStorage.removeItem('battleshipGame');
  };

  // Set game mode
  const setGameMode = (mode) => {
    setGameState(prevState => ({
      ...prevState,
      mode
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
    // Implement player move logic
    console.log(`Player moved to ${row}, ${col}`);
  };

  // Place ship
  const placeShip = (shipId, position, orientation) => {
    // Implement ship placement logic
    console.log(`Placing ship ${shipId} at ${position} in ${orientation} orientation`);
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        resetGame,
        setGameMode,
        startGame,
        playerMove,
        placeShip
      }}
    >
      {children}
    </GameContext.Provider>
  );
}; 