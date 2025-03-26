import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <header className="hero">
        <h1>🚢 Battleship Game</h1>
        <div className="hero-image">
          <img src="/assets/images/battleship-game.jpg" alt="Battleship Game" />
        </div>
        
        <div className="mode-buttons">
          <Link to="/game/normal" className="btn-play">
            Start Game
            <p>Battle against the AI in standard mode</p>
          </Link>
          
          <Link to="/game/freeplay" className="btn-play">
            Free Play
            <p>Place your ships freely and battle</p>
          </Link>
        </div>
      </header>
    </div>
  );
};

export default Home; 