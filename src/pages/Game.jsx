import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { GameContext } from '../context/GameContext';
import Board from '../components/Board/Board';
import Timer from '../components/Timer/Timer';

const Game = () => {
  const { mode } = useParams();
  const { gameState, setGameMode, resetGame } = useContext(GameContext);
  
  // Set game mode on component mount
  useEffect(() => {
    if (mode === 'normal' || mode === 'easy') {
      setGameMode(mode);
    }
  }, [mode, setGameMode]);
  
  return (
    <div className="game-container">
      <h1>Game Page - {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode</h1>
      
      {/* Timer */}
      <Timer />
      
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