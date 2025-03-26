import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
        <li><NavLink to="/game/normal" className={({ isActive }) => isActive ? 'active' : ''}>Game</NavLink></li>
        <li><NavLink to="/rules" className={({ isActive }) => isActive ? 'active' : ''}>Rules</NavLink></li>
        <li><NavLink to="/highscores" className={({ isActive }) => isActive ? 'active' : ''}>High Scores</NavLink></li>
      </ul>
    </nav>
  );
};

export default Navbar; 