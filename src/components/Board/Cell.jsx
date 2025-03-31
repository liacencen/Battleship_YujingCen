import React from 'react';
import './Cell.css';

const Cell = ({ type, state, onClick }) => {
  const getClassName = () => {
    const classes = ['cell'];
    
    if (state === 'ship' && type === 'player') {
      classes.push('ship');
    }
    if (state === 'hit') {
      classes.push('hit');
    }
    if (state === 'miss') {
      classes.push('miss');
    }
    
    return classes.join(' ');
  };

  return (
    <div 
      className={getClassName()}
      onClick={onClick}
    >
      {state === 'hit' && <span className="hit-marker">X</span>}
      {state === 'miss' && <span className="miss-marker">•</span>}
    </div>
  );
};

export default Cell; 