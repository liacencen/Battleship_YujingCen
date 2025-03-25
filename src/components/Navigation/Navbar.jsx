import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><NavLink to="/" end>Home</NavLink></li>
        <li><NavLink to="/game/normal">Normal Game</NavLink></li>
        <li><NavLink to="/game/easy">Free Play</NavLink></li>
        <li><NavLink to="/rules">Rules</NavLink></li>
        <li><NavLink to="/highscores">High Scores</NavLink></li>
      </ul>
    </nav>
  );
};

export default Navbar; 