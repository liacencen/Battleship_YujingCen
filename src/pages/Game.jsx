import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GameContext } from '../context/GameContext';
import Board from '../components/Board/Board';
import Timer from '../components/Timer/Timer';
import ShipPlacement from '../components/ShipPlacement/ShipPlacement';

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Game component error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2>Something went wrong</h2>
          <p>Error: {this.state.error.toString()}</p>
          <button onClick={() => window.location.href = '/'}>
            Return to Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const Game = () => {
  // Get mode from URL params
  const params = useParams();
  const gameMode = params.mode; // This should match the :mode parameter in your route
  
  const navigate = useNavigate();
  const { gameState, setGameMode, resetGame, getCurrentShip } = useContext(GameContext);
  const [orientation, setOrientation] = useState('horizontal');
  const [isLoading, setIsLoading] = useState(true);
  
  // For debugging
  console.log("Game component rendered with mode:", gameMode);
  console.log("Current game state:", gameState);
  
  // Reset localStorage on mount or if there's an issue
  useEffect(() => {
    const resetLocalStorageIfNeeded = () => {
      try {
        const savedState = localStorage.getItem('battleshipGame');
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          // If saved mode doesn't match current mode, reset
          if (parsedState.mode && parsedState.mode !== gameMode) {
            console.log("Resetting localStorage due to mode mismatch");
            localStorage.removeItem('battleshipGame');
          }
        }
      } catch (e) {
        console.error("Error checking localStorage, resetting:", e);
        localStorage.removeItem('battleshipGame');
      }
    };
    
    resetLocalStorageIfNeeded();
  }, [gameMode]);
  
  // Set game mode on component mount
  useEffect(() => {
    console.log("Setting game mode:", gameMode);
    if (gameMode === 'normal' || gameMode === 'freeplay') {
      setGameMode(gameMode);
      // Give some time for state to update
      setTimeout(() => setIsLoading(false), 500);
    } else {
      // Invalid mode, redirect to home
      console.error("Invalid game mode:", gameMode);
      navigate('/');
    }
  }, [gameMode, setGameMode, navigate]);
  
  // Monitor game state changes
  useEffect(() => {
    console.log("Game state updated:", gameState);
    if (gameState.mode) {
      setIsLoading(false);
    }
  }, [gameState]);
  
  // Toggle ship orientation
  const toggleOrientation = () => {
    setOrientation(prev => prev === 'horizontal' ? 'vertical' : 'horizontal');
  };
  
  // Get current ship to place
  const currentShip = getCurrentShip();
  
  // Render ship placement UI for freeplay mode
  const renderShipPlacement = () => {
    if (gameState.mode !== 'freeplay' || gameState.gameStatus !== 'setup') {
      return null;
    }
    
    return (
      <div className="ship-placement-container">
        <h2>Place Your Ships</h2>
        {currentShip ? (
          <>
            <p>Placing: {currentShip.name} ({currentShip.size} cells)</p>
            <button className="orientation-btn" onClick={toggleOrientation}>
              Orientation: {orientation === 'horizontal' ? 'Horizontal →' : 'Vertical ↓'}
            </button>
            <ShipPlacement 
              ship={currentShip} 
              orientation={orientation} 
            />
          </>
        ) : (
          <p>All ships placed! Game will start automatically.</p>
        )}
      </div>
    );
  };
  
  // Show loading state
  if (isLoading || !gameState || !gameState.mode) {
    return (
      <div className="game-container loading-container">
        <h1>Loading Game...</h1>
        <p>Setting up {gameMode} mode</p>
        <div className="loading-spinner"></div>
      </div>
    );
  }
  
  return (
    <ErrorBoundary>
      <div className="game-container">
        <h1>Battleship - {gameState.mode.charAt(0).toUpperCase() + gameState.mode.slice(1)} Mode</h1>
        
        {/* Ship placement UI */}
        {renderShipPlacement()}
        
        {/* Timer */}
        {gameState.gameStatus === 'playing' && <Timer />}
        
        {/* Game status and winner */}
        {gameState.winner && (
          <div className="game-over">
            <h2>Game over! {gameState.winner === 'player' ? 'You' : 'AI'} Won!</h2>
          </div>
        )}
        
        <div className="boards-container">
          {/* Enemy Board */}
          <Board type="ai" />
          
          {/* Player Board */}
          <Board type="player" />
        </div>
        
        {/* Restart button */}
        <button className="restart-btn" onClick={() => {
          resetGame();
          // Force page reload to ensure clean state
          window.location.reload();
        }}>
          Restart
        </button>
      </div>
    </ErrorBoundary>
  );
};

export default Game; 