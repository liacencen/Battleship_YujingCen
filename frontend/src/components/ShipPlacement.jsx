import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Button, 
  Paper,
  Alert 
} from '@mui/material';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isTouchDevice } from '../utils/device';

// Ship component for dragging
const Ship = ({ id, size, name, isPlaced, onRotate }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ship',
    item: { id, size, name },
    canDrag: !isPlaced,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }));

  return (
    <Box
      ref={drag}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        opacity: isDragging ? 0.5 : isPlaced ? 0.3 : 1,
        cursor: isPlaced ? 'not-allowed' : 'move',
        marginBottom: 1,
        width: 'fit-content'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mr: 1,
          cursor: 'pointer'
        }}
        onClick={() => onRotate(id)}
      >
        <Typography variant="caption">⟳</Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row'
        }}
      >
        {Array(size).fill().map((_, i) => (
          <Box
            key={i}
            sx={{
              width: '30px',
              height: '30px',
              backgroundColor: '#64b5f6',
              border: '1px solid #1976d2',
              borderRadius: i === 0 ? '5px 0 0 5px' : i === size - 1 ? '0 5px 5px 0' : 0
            }}
          ></Box>
        ))}
      </Box>
      <Box sx={{ ml: 1 }}>
        <Typography variant="caption">{name}</Typography>
      </Box>
    </Box>
  );
};

// Cell component for the board
const Cell = ({ row, col, value, canDrop, isOver, drop }) => {
  // Determine background color based on state
  const getBackgroundColor = () => {
    if (isOver && canDrop) return '#81c784'; // Green when valid drop
    if (isOver && !canDrop) return '#e57373'; // Red when invalid drop
    if (value) return '#64b5f6'; // Blue for occupied
    return '#ffffff'; // White for empty
  };

  return (
    <Box
      ref={drop}
      sx={{
        width: '30px',
        height: '30px',
        border: '1px solid #90a4ae',
        backgroundColor: getBackgroundColor(),
        transition: 'background-color 0.2s'
      }}
    ></Box>
  );
};

// Board component for ship placement
const Board = ({ board, onDrop }) => {
  const [, drop] = useDrop(() => ({
    accept: 'ship',
    canDrop: () => false, // Board itself can't accept drops
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));

  return (
    <Box ref={drop} sx={{ display: 'inline-block' }}>
      <Grid container spacing={0}>
        {board.map((row, rowIndex) => (
          <Grid container item key={rowIndex}>
            {row.map((cell, colIndex) => {
              const [{ isOver, canDrop }, cellDrop] = useDrop(() => ({
                accept: 'ship',
                canDrop: (item) => {
                  const { id, size } = item;
                  // Check if placement is valid
                  return isValidPlacement(board, id, rowIndex, colIndex, size, ships.find(s => s.id === id).isHorizontal);
                },
                drop: (item) => {
                  onDrop(item, rowIndex, colIndex);
                },
                collect: (monitor) => ({
                  isOver: !!monitor.isOver(),
                  canDrop: !!monitor.canDrop()
                })
              }));

              return (
                <Cell
                  key={`${rowIndex}-${colIndex}`}
                  row={rowIndex}
                  col={colIndex}
                  value={cell}
                  canDrop={canDrop}
                  isOver={isOver}
                  drop={cellDrop}
                />
              );
            })}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// Define ship data
const initialShips = [
  { id: 'carrier', name: 'Carrier', size: 5, isPlaced: false, position: null, isHorizontal: true },
  { id: 'battleship', name: 'Battleship', size: 4, isPlaced: false, position: null, isHorizontal: true },
  { id: 'cruiser', name: 'Cruiser', size: 3, isPlaced: false, position: null, isHorizontal: true },
  { id: 'submarine', name: 'Submarine', size: 3, isPlaced: false, position: null, isHorizontal: true },
  { id: 'destroyer', name: 'Destroyer', size: 2, isPlaced: false, position: null, isHorizontal: true }
];

// Check if ship placement is valid
const isValidPlacement = (board, shipId, row, col, size, isHorizontal) => {
  // Check if out of bounds
  if (isHorizontal) {
    if (col + size > 10) return false;
  } else {
    if (row + size > 10) return false;
  }

  // Check if overlaps with other ships
  for (let i = 0; i < size; i++) {
    const r = isHorizontal ? row : row + i;
    const c = isHorizontal ? col + i : col;
    
    if (board[r][c] !== null) {
      return false;
    }
  }

  return true;
};

// Create an empty board
const createEmptyBoard = () => {
  return Array(10).fill().map(() => Array(10).fill(null));
};

// Main ShipPlacement component
const ShipPlacement = ({ onComplete }) => {
  const [ships, setShips] = useState(initialShips);
  const [board, setBoard] = useState(createEmptyBoard());
  const [error, setError] = useState(null);

  // Handle rotation of ships
  const handleRotateShip = (shipId) => {
    setShips(ships.map(ship => 
      ship.id === shipId 
        ? { ...ship, isHorizontal: !ship.isHorizontal } 
        : ship
    ));
  };

  // Handle dropping a ship on the board
  const handleDrop = (item, row, col) => {
    const { id, size } = item;
    const ship = ships.find(s => s.id === id);
    
    if (!ship) return;
    
    // Remove previous placement if ship was already placed
    let newBoard = [...board.map(row => [...row])];
    if (ship.isPlaced && ship.position) {
      const { row: oldRow, col: oldCol, isHorizontal: oldOrientation } = ship.position;
      
      for (let i = 0; i < ship.size; i++) {
        const r = oldOrientation ? oldRow : oldRow + i;
        const c = oldOrientation ? oldCol + i : oldCol;
        newBoard[r][c] = null;
      }
    }
    
    // Add new placement
    const isHorizontal = ship.isHorizontal;
    
    for (let i = 0; i < size; i++) {
      const r = isHorizontal ? row : row + i;
      const c = isHorizontal ? col + i : col;
      newBoard[r][c] = {
        id: id,
        index: i,
        size: size,
        horizontal: isHorizontal
      };
    }
    
    setBoard(newBoard);
    
    // Update ship state
    setShips(ships.map(s => 
      s.id === id 
        ? { ...s, isPlaced: true, position: { row, col, isHorizontal } } 
        : s
    ));
    
    setError(null);
  };

  // Reset placements
  const handleReset = () => {
    setBoard(createEmptyBoard());
    setShips(initialShips);
    setError(null);
  };

  // Complete placement and submit
  const handleComplete = () => {
    // Check if all ships are placed
    if (ships.some(ship => !ship.isPlaced)) {
      setError('Please place all ships before continuing');
      return;
    }
    
    // Call the onComplete callback with the board
    onComplete(board);
  };

  // Pick the appropriate backend based on device
  const backendForDND = isTouchDevice() ? TouchBackend : HTML5Backend;

  return (
    <DndProvider backend={backendForDND}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Place Your Ships
        </Typography>
        
        <Typography variant="body2" paragraph>
          Drag ships from the list and drop them on the board. Click the rotation icon (⟳) to rotate a ship.
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Ships
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
              {ships.map((ship) => (
                <Ship
                  key={ship.id}
                  id={ship.id}
                  size={ship.size}
                  name={ship.name}
                  isPlaced={ship.isPlaced}
                  onRotate={handleRotateShip}
                />
              ))}
            </Box>
            <Box sx={{ mt: 2 }}>
              <Button 
                variant="outlined" 
                color="secondary" 
                onClick={handleReset}
                sx={{ mr: 1 }}
              >
                Reset
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleComplete}
              >
                Confirm Placement
              </Button>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Your Board
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Board board={board} onDrop={handleDrop} />
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </DndProvider>
  );
};

export default ShipPlacement; 