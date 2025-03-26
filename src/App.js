import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';

// Components
import Navbar from './components/Navigation/Navbar';
import Footer from './components/Footer/Footer';

// Pages
import Home from './pages/Home';
import Game from './pages/Game';
import Rules from './pages/Rules';
import HighScores from './pages/HighScores';

// Import global styles
import './styles/global.css';

// Clear localStorage for a fresh start (remove this in production)
console.log("App initialized, clearing any existing game state");
localStorage.removeItem('battleshipGame');

function App() {
  return (
    <GameProvider>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game/:mode" element={<Game />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/highscores" element={<HighScores />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </GameProvider>
  );
}

export default App; 