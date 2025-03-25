# Battleship Game

A modern implementation of the classic Battleship game with React.

## Features

- Play against AI in normal mode
- Practice in free play mode without an opponent
- Drag and drop ship placement
- Game state persistence with localStorage
- Responsive design for mobile and desktop
- Timer to track game duration

## Game Rules

- Each player has a 10x10 grid
- 5 ships of different sizes: Carrier (5), Battleship (4), Cruisers (3x2), Destroyer (2)
- Players take turns firing at each other's grids
- First player to sink all enemy ships wins

## Technical Implementation

- Built with React
- State management with Context API
- Responsive UI using CSS Grid/Flexbox
- Ship placement using drag and drop

## Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## Project Structure

- `src/components`: Reusable UI components
- `src/pages`: Main application views
- `src/context`: React Context for state management
- `src/styles`: Global CSS styles

## Deployment

Deployed on Render at [https://battleship-game.onrender.com](https://battleship-game.onrender.com)
