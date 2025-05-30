import React, { useContext } from 'react';
import { GameContext } from '../../context/GameContext';
import './Timer.css';

const Timer = () => {
  const { gameState } = useContext(GameContext);
  
  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="timer">
      Game Time: {formatTime(gameState.timer)}
    </div>
  );
};

export default Timer; 