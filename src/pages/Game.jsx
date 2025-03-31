import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { GameContext } from '../context/GameContext';
import Board from '../components/Board/Board';
import Timer from '../components/Timer/Timer';
import ShipPlacement from '../components/ShipPlacement/ShipPlacement';
import './Game.css';

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
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { gameState, setGameMode, resetGame, getCurrentShip } = useContext(GameContext);
  const [orientation, setOrientation] = useState('horizontal');
  const [isLoading, setIsLoading] = useState(true);

  // Reset game when component mounts or game mode changes
  useEffect(() => {
    const validModes = ['normal', 'freeplay'];
    const gameMode = params.mode;

    if (!validModes.includes(gameMode)) {
      console.error("Invalid game mode:", gameMode);
      navigate('/');
      return;
    }

    // Reset game state if:
    // 1. No game state exists
    // 2. Current mode doesn't match URL mode
    // 3. Game has ended
    if (!gameState.mode || 
        gameState.mode !== gameMode || 
        gameState.gameStatus === 'ended') {
      resetGame();
      setGameMode(gameMode);
    }

    // Remove loading state after a short delay
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [params.mode, location.pathname, gameState.mode, gameState.gameStatus, resetGame, setGameMode, navigate]);

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
        <p>Setting up {params.mode} mode</p>
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
        <button 
          className="restart-btn" 
          onClick={() => {
            resetGame();
            setGameMode(params.mode);
          }}
        >
          Restart Game
        </button>
      </div>
    </ErrorBoundary>
  );
};

export default Game; 