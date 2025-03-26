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
      return 'X'; // Red X for hits
    } else if (value === 'miss') {
      return '✓'; // Green check for misses
    } else if (value === 'ship' && type === 'player') {
      return '●'; // Black dot for ships on player's board
    }
    return null;
  };
  
  // Don't allow clicking on cells that are already hit or missed
  const handleClick = () => {
    if (value !== 'hit' && value !== 'miss') {
      onClick();
    }
  };
  
  return (
    <div 
      className={getCellClassName()}
      onClick={handleClick}
      title={`${type === 'player' ? 'Your' : 'Enemy'} board cell`}
    >
      {renderIcon()}
    </div>
  );
};

export default Cell; 