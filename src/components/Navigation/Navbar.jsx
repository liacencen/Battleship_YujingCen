import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    // Force navigation to clean state
    navigate(path);
    console.log("Navigating to:", path);
  };

  return (
    <nav>
      <ul>
        <li><NavLink to="/" end onClick={() => handleNavigation('/')} className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
        <li><NavLink to="/game/normal" onClick={() => handleNavigation('/game/normal')} className={({ isActive }) => isActive ? 'active' : ''}>Game</NavLink></li>
        <li><NavLink to="/rules" onClick={() => handleNavigation('/rules')} className={({ isActive }) => isActive ? 'active' : ''}>Rules</NavLink></li>
        <li><NavLink to="/highscores" onClick={() => handleNavigation('/highscores')} className={({ isActive }) => isActive ? 'active' : ''}>High Scores</NavLink></li>
      </ul>
    </nav>
  );
};

export default Navbar; 