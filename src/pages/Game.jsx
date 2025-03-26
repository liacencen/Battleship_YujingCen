import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GameContext } from '../context/GameContext';
import Board from '../components/Board/Board';
import Timer from '../components/Timer/Timer';
import ShipPlacement from '../components/ShipPlacement/ShipPlacement';

const Game = () => {
  const { mode } = useParams();
  const navigate = useNavigate();
  const { gameState, setGameMode, resetGame, getCurrentShip } = useContext(GameContext);
  const [orientation, setOrientation] = useState('horizontal');
  
  // Set game mode on component mount
  useEffect(() => {
    if (mode === 'normal' || mode === 'freeplay') {
      setGameMode(mode);
    } else {
      // Invalid mode, redirect to home
      navigate('/');
    }
  }, [mode, setGameMode, navigate]);
  
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
  
  return (
    <div className="game-container">
      <h1>Battleship - {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode</h1>
      
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
      <button className="restart-btn" onClick={resetGame}>
        Restart
      </button>
    </div>
  );
};

export default Game; 