import React from 'react';

const Rules = () => {
  return (
    <div className="rules-container">
      <h1>Battleship Game Rules</h1>
      
      <div className="rules-content">
        <section>
          <h2>Game Setup</h2>
          <p>Battleship is a classic two-player strategy game where you and your opponent (the AI) each place your fleet of ships on a 10×10 grid. Ships are placed either horizontally or vertically, and they cannot overlap.</p>
          <p>Each player's fleet consists of the following ships:</p>
          <ul>
            <li>Carrier (5 cells)</li>
            <li>Battleship (4 cells)</li>
            <li>Two Cruisers (3 cells each)</li>
            <li>Destroyer (2 cells)</li>
          </ul>
        </section>
        
        <section>
          <h2>Game Objective</h2>
          <p>The objective of the game is to sink all of your opponent's ships before they sink yours.</p>
        </section>
        
        <section>
          <h2>How to Play</h2>
          <ol>
            <li>At the start of the game, you drag and place your ships on your board.</li>
            <li>You and the AI take turns firing at each other's grids by selecting a cell on the opponent's board.</li>
            <li>If a shot hits a ship, the cell will be marked as a hit (✔).</li>
            <li>If a shot misses, the cell will be marked as a miss (❌).</li>
            <li>A ship is sunk when all its cells have been hit.</li>
            <li>The game ends when all ships of one player have been sunk.</li>
          </ol>
        </section>
        
        <section>
          <h2>Game Modes</h2>
          <h3>Normal Mode</h3>
          <p>In normal mode, you play against the AI in a classic game of Battleship. You and the AI take turns firing at each other's board.</p>
          
          <h3>Free Play Mode</h3>
          <p>In free play mode, you practice your strategy without an opponent. You can fire at the AI's board, but the AI will not take any turns or fire at your board.</p>
        </section>
      </div>
    </div>
  );
};

export default Rules; 