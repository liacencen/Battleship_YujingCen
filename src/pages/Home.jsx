import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { GameContext } from '../context/GameContext';

const Home = () => {
  const { resetGame } = useContext(GameContext);

  return (
    <div className="home-container">
      <h1>Battleship Game</h1>
      
      <div className="hero-image">
        <img src="/assets/battleship-hero.jpg" alt="Battleship Game" />
      </div>
      
      <div className="game-mode-selection">
        <h2>Select Game Mode</h2>
        
        <div className="mode-buttons">
          <Link 
            to="/game/normal" 
            className="btn-play"
            onClick={resetGame}
          >
            Normal Game
            <p>Battle against the AI in this classic mode</p>
          </Link>
          
          <Link 
            to="/game/easy" 
            className="btn-play"
            onClick={resetGame}
          >
            Free Play
            <p>Practice mode with no AI opponent</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home; 