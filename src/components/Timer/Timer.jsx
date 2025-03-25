import React, { useContext } from 'react';
import { GameContext } from '../../context/GameContext';

const Timer = () => {
  const { gameState } = useContext(GameContext);
  
  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <p className="timer">
      Time: <span id="timer">{formatTime(gameState.timer)}</span>
    </p>
  );
};

export default Timer; 