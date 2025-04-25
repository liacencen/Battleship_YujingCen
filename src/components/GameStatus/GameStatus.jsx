import React, { useContext } from 'react';
import { GameContext } from '../../context/GameContext';
import './GameStatus.css';

const GameStatus = () => {
  const { gameState } = useContext(GameContext);

  if (!gameState.winner) {
    return null;
  }

  return (
    <div className="game-over">
      <h2>Game over! {gameState.winner === 'player' ? 'You' : 'AI'} Won!</h2>
    </div>
  );
};

export default GameStatus; 