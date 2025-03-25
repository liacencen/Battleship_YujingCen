import React, { useContext } from 'react';
import { GameContext } from '../../context/GameContext';
import Cell from './Cell';

const Board = ({ type }) => {
  const { gameState, playerMove } = useContext(GameContext);
  const board = type === 'player' ? gameState.playerBoard : gameState.aiBoard;

  const handleCellClick = (row, col) => {
    // Only allow clicks on AI board when it's player's turn
    if (type === 'ai' && gameState.currentTurn === 'player' && gameState.gameStatus === 'playing') {
      playerMove(row, col);
    }
  };

  return (
    <div className="board-section">
      <h2>{type === 'player' ? 'Your Board' : 'Enemy Board'}</h2>
      <div className={`grid ${type}-board`}>
        {board.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <Cell
              key={`${type}-${rowIndex}-${colIndex}`}
              type={type}
              value={cell}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            />
          ))
        ))}
      </div>
    </div>
  );
};

export default Board; 