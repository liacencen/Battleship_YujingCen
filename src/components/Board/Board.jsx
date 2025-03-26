import React, { useContext } from 'react';
import { GameContext } from '../../context/GameContext';
import Cell from './Cell';

const Board = ({ type }) => {
  const { gameState, playerMove } = useContext(GameContext);
  
  if (!gameState || !gameState.playerBoard || !gameState.aiBoard) {
    return (
      <div className="board-section">
        <h2>{type === 'player' ? 'Your Board' : 'Enemy Board'}</h2>
        <div className="board-error">Board data not available</div>
      </div>
    );
  }
  
  const board = type === 'player' ? gameState.playerBoard : gameState.aiBoard;

  const handleCellClick = (row, col) => {
    if (type === 'ai' && gameState.currentTurn === 'player' && gameState.gameStatus === 'playing') {
      playerMove(row, col);
    }
  };

  // Render the 10x10 grid
  const renderRows = () => {
    const rows = [];
    
    for (let i = 0; i < 10; i++) {
      const cells = [];
      for (let j = 0; j < 10; j++) {
        cells.push(
          <Cell
            key={`${i}-${j}`}
            type={type}
            value={board[i][j]}
            onClick={() => handleCellClick(i, j)}
          />
        );
      }
      rows.push(<div key={`row-${i}`} className="grid-row">{cells}</div>);
    }
    
    return rows;
  };

  return (
    <div className="board-section">
      <h2>{type === 'player' ? 'Your Board' : 'Enemy Board'}</h2>
      <div className={`grid ${type}-board`}>
        {renderRows()}
      </div>
      {type === 'player' && gameState.currentTurn === 'ai' && !gameState.winner && (
        <div className="turn-indicator">AI is thinking...</div>
      )}
      {type === 'ai' && gameState.currentTurn === 'player' && !gameState.winner && (
        <div className="turn-indicator">Your turn! Select a square on the enemy board.</div>
      )}
    </div>
  );
};

export default Board; 