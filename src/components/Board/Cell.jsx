import React from 'react';

const Cell = ({ type, value, onClick }) => {
  // Generate class names based on cell state
  const getCellClassName = () => {
    let className = 'grid-cell';
    
    if (value === 'hit') {
      className += ' hit';
    } else if (value === 'miss') {
      className += ' miss';
    } else if (value === 'ship' && type === 'player') {
      className += ' ship';
    }
    
    return className;
  };
  
  // Determine which icon to display
  const renderIcon = () => {
    if (value === 'hit') {
      return type === 'player' ? '⚫' : '✔';
    } else if (value === 'miss') {
      return '❌';
    }
    return null;
  };
  
  return (
    <div 
      className={getCellClassName()}
      onClick={onClick}
    >
      {renderIcon()}
    </div>
  );
};

export default Cell; 