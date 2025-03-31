import React, { useContext } from 'react';
import { GameContext } from '../../context/GameContext';
import Cell from './Cell';
import './Board.css';

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
  const ships = type === 'player' ? gameState.playerShips : gameState.aiShips;
  const moves = type === 'player' ? gameState.aiMoves : gameState.playerMoves;

  const getCellState = (row, col) => {
    // Check if cell has been hit or missed
    const move = moves.find(m => m.row === row && m.col === col);
    if (move) {
      return move.result;
    }

    // For player board, show ships
    if (type === 'player' && board[row][col] === 'ship') {
      return 'ship';
    }

    // For AI board in freeplay mode, hide ships
    if (type === 'ai' && gameState.mode === 'freeplay') {
      return null;
    }

    return board[row][col];
  };

  const handleCellClick = (row, col) => {
    if (type === 'ai' && 
        gameState.currentTurn === 'player' && 
        gameState.gameStatus === 'playing' &&
        !moves.some(m => m.row === row && m.col === col)) {
      playerMove(row, col);
    }
  };

  // Render the 10x10 grid
  const renderRows = () => {
    const rows = [];
    
    for (let i = 0; i < 10; i++) {
      const cells = [];
      for (let j = 0; j < 10; j++) {
        const cellState = getCellState(i, j);
        cells.push(
          <Cell
            key={`${i}-${j}`}
            type={type}
            state={cellState}
            onClick={() => handleCellClick(i, j)}
          />
        );
      }
      rows.push(<div key={`row-${i}`} className="board-row">{cells}</div>);
    }
    
    return rows;
  };

  return (
    <div className="board-section">
      <h2>{type === 'player' ? 'Your Board' : 'Enemy Board'}</h2>
      <div className={`board ${type}-board`}>
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