import React, { useContext } from 'react';
import { GameContext } from '../../context/GameContext';
import Cell from './Cell';

const Board = ({ type }) => {
  const { gameState, playerMove } = useContext(GameContext);
  
  if (!gameState || !gameState.playerBoard || !gameState.aiBoard) {
    console.error("Invalid game state in Board component:", gameState);
    return (
      <div className="board-section">
        <h2>{type === 'player' ? 'Your Board' : 'Enemy Board'}</h2>
        <div className="board-error">Board data not available</div>
      </div>
    );
  }
  
  const board = type === 'player' ? gameState.playerBoard : gameState.aiBoard;

  const handleCellClick = (row, col) => {
    // Only allow clicks on AI board when it's player's turn and the game is in playing state
    if (type === 'ai' && gameState.currentTurn === 'player' && gameState.gameStatus === 'playing') {
      console.log(`Clicking on AI board at ${row}, ${col}`);
      playerMove(row, col);
    } else if (type === 'ai') {
      console.log(`Cannot click AI board: currentTurn=${gameState.currentTurn}, gameStatus=${gameState.gameStatus}`);
    }
  };

  // Generate 10x10 grid of cells
  const renderGrid = () => {
    const grid = [];
    
    for (let rowIndex = 0; rowIndex < 10; rowIndex++) {
      for (let colIndex = 0; colIndex < 10; colIndex++) {
        grid.push(
          <Cell
            key={`${type}-${rowIndex}-${colIndex}`}
            type={type}
            value={board[rowIndex][colIndex]}
            onClick={() => handleCellClick(rowIndex, colIndex)}
          />
        );
      }
    }
    
    return grid;
  };

  return (
    <div className="board-section">
      <h2>{type === 'player' ? 'Your Board' : 'Enemy Board'}</h2>
      <div className={`grid ${type}-board`}>
        {renderGrid()}
      </div>
      {type === 'player' && gameState.currentTurn === 'ai' && gameState.gameStatus === 'playing' && (
        <div className="turn-indicator">AI is thinking...</div>
      )}
      {type === 'ai' && gameState.currentTurn === 'player' && gameState.gameStatus === 'playing' && (
        <div className="turn-indicator">Your turn</div>
      )}
    </div>
  );
};

export default Board; 