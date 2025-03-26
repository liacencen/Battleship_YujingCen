import React, { useContext, useState, useRef, useEffect } from 'react';
import { GameContext } from '../../context/GameContext';

const ShipPlacement = ({ ship, orientation }) => {
  const { placePlayerShip, gameState } = useContext(GameContext);
  const [hoverPosition, setHoverPosition] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const gridRef = useRef(null);
  
  // Create a blank 10x10 grid for placement
  const grid = Array(10).fill().map(() => Array(10).fill(null));
  
  // Handle hover over a cell
  const handleCellHover = (row, col) => {
    setHoverPosition({ row, col });
  };
  
  // Handle cell click - place ship
  const handleCellClick = (row, col) => {
    placePlayerShip(row, col, orientation);
  };
  
  // Handle ship drag start
  const handleDragStart = (e) => {
    setIsDragging(true);
    
    // Calculate drag offset
    const shipElement = e.currentTarget;
    const rect = shipElement.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    // Add event listeners for drag events
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
  };
  
  // Handle ship drag move
  const handleDragMove = (e) => {
    if (!isDragging || !gridRef.current) return;
    
    const gridRect = gridRef.current.getBoundingClientRect();
    const cellSize = 30; // Match CSS cell size
    
    // Calculate grid position
    const x = e.clientX - gridRect.left - dragOffset.x;
    const y = e.clientY - gridRect.top - dragOffset.y;
    
    // Convert to row/col
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    
    // Update hover position
    if (row >= 0 && row < 10 && col >= 0 && col < 10) {
      setHoverPosition({ row, col });
    }
  };
  
  // Handle ship drag end
  const handleDragEnd = (e) => {
    setIsDragging(false);
    
    // Remove event listeners
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
    
    // Place ship at current hover position
    if (hoverPosition && isValidPlacement(hoverPosition.row, hoverPosition.col)) {
      handleCellClick(hoverPosition.row, hoverPosition.col);
    }
  };
  
  // Clean up event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, []);
  
  // Check if ship can be placed at current hover position
  const isValidPlacement = (row, col) => {
    if (!hoverPosition) return false;
    
    // Check if ship fits on board
    if (orientation === 'horizontal' && col + ship.size > 10) return false;
    if (orientation === 'vertical' && row + ship.size > 10) return false;
    
    // Check if position is occupied
    for (let i = 0; i < ship.size; i++) {
      const checkRow = orientation === 'horizontal' ? row : row + i;
      const checkCol = orientation === 'horizontal' ? col + i : col;
      
      if (gameState.playerBoard[checkRow][checkCol] !== null) {
        return false;
      }
    }
    
    return true;
  };
  
  // Render the placement grid
  return (
    <div className="placement-container">
      <div className="ship-preview">
        <div 
          className={`ship-drag ${orientation}`} 
          style={{ width: orientation === 'horizontal' ? ship.size * 30 : 30, height: orientation === 'vertical' ? ship.size * 30 : 30 }}
          onMouseDown={handleDragStart}
        >
          {ship.name}
        </div>
      </div>
      
      <div className="placement-grid" ref={gridRef}>
        {grid.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="placement-row">
            {row.map((_, colIndex) => {
              // Determine if this cell is part of the hover preview
              const isShipPreview = hoverPosition && 
                ((orientation === 'horizontal' && 
                  rowIndex === hoverPosition.row && 
                  colIndex >= hoverPosition.col && 
                  colIndex < hoverPosition.col + ship.size) || 
                (orientation === 'vertical' && 
                  colIndex === hoverPosition.col && 
                  rowIndex >= hoverPosition.row && 
                  rowIndex < hoverPosition.row + ship.size));
              
              // Determine if placement is valid
              const isValid = hoverPosition && isValidPlacement(hoverPosition.row, hoverPosition.col);
              
              return (
                <div
                  key={`cell-${rowIndex}-${colIndex}`}
                  className={`placement-cell ${isShipPreview ? (isValid ? 'valid-placement' : 'invalid-placement') : ''} ${gameState.playerBoard[rowIndex][colIndex] === 'ship' ? 'occupied' : ''}`}
                  onMouseEnter={() => handleCellHover(rowIndex, colIndex)}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                />
              );
            })}
          </div>
        ))}
      </div>
      <p className="placement-help">
        Drag the ship and drop it on the grid, or click on a cell to place the ship.
      </p>
    </div>
  );
};

export default ShipPlacement; 