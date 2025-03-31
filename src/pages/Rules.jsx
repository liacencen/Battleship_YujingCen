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
          <h2>Game Modes</h2>
          <h3>Normal Mode</h3>
          <p>In normal mode, your ships are placed automatically and you play against the AI. The AI uses a smart targeting strategy:</p>
          <ul>
            <li>When it hits a ship, it will focus on adjacent cells to try to sink the ship</li>
            <li>If no adjacent cells are available, it will make random moves</li>
            <li>This makes the AI more challenging and realistic</li>
          </ul>

          <h3>Free Play Mode</h3>
          <p>In free play mode, you have control over ship placement:</p>
          <ul>
            <li>Drag and drop ships onto your board</li>
            <li>Click on cells to place ships</li>
            <li>Practice your strategy without AI interference</li>
          </ul>
        </section>
        
        <section>
          <h2>How to Play</h2>
          <ol>
            <li>Choose your game mode (Normal or Free Play)</li>
            <li>If in Free Play mode, place your ships by dragging them onto the board</li>
            <li>You and the AI take turns firing at each other's grids by selecting a cell on the opponent's board</li>
            <li>If a shot hits a ship, the cell will be marked as a hit (X)</li>
            <li>If a shot misses, the cell will be marked as a miss (•)</li>
            <li>A ship is sunk when all its cells have been hit</li>
            <li>The game ends when all ships of one player have been sunk</li>
          </ol>
        </section>

        <section>
          <h2>Game Features</h2>
          <ul>
            <li>Game state is automatically saved - you can continue your game even if you close the browser</li>
            <li>Timer tracks how long you've been playing</li>
            <li>Visual feedback for ship placement and hits</li>
            <li>Responsive design works on both desktop and mobile devices</li>
          </ul>
        </section>
        
        <section>
          <h2>Tips for Success</h2>
          <ul>
            <li>Spread your ships out to make them harder to find</li>
            <li>Pay attention to the AI's targeting pattern in normal mode</li>
            <li>Use the free play mode to practice different strategies</li>
            <li>Try to identify ship patterns based on hit locations</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Rules; 