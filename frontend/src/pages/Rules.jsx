import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import WarningIcon from '@mui/icons-material/Warning';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SettingsIcon from '@mui/icons-material/Settings';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

const Rules = () => {
  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Battleship Rules
      </Typography>
      
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <DirectionsBoatIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h5" component="h2">
            Game Overview
          </Typography>
        </Box>
        <Typography variant="body1" paragraph>
          Battleship is a classic game of naval combat where players take turns firing at each other's fleet of ships. The objective is to sink all of your opponent's ships before they sink yours.
        </Typography>
        <Typography variant="body1">
          Each player has a fleet of 5 ships of different sizes:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText primary="Carrier (5 spaces)" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Battleship (4 spaces)" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Cruiser (3 spaces)" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Submarine (3 spaces)" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Destroyer (2 spaces)" />
          </ListItem>
        </List>
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SettingsIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h5" component="h2">
                Game Setup
              </Typography>
            </Box>
            <List>
              <ListItem>
                <ListItemIcon>
                  <PlayArrowIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Create a new game or join an existing one" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PlayArrowIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Ships are automatically placed on your board randomly" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PlayArrowIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Wait for an opponent to join your game or join someone else's game" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PlayArrowIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="The game begins once two players are in the game" />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PlayArrowIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h5" component="h2">
                How to Play
              </Typography>
            </Box>
            <List>
              <ListItem>
                <ListItemIcon>
                  <PlayArrowIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Players take turns firing at each other's grid" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PlayArrowIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Click on a cell in your opponent's grid to fire a shot" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PlayArrowIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="A hit is marked with red, and a miss with white" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PlayArrowIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="A ship is sunk when all of its cells are hit" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PlayArrowIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Refresh the page to see if your opponent has made a move" />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EmojiEventsIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h5" component="h2">
                Winning the Game
              </Typography>
            </Box>
            <Typography variant="body1" paragraph>
              The first player to sink all of their opponent's ships wins the game. Once a game is over, the result is recorded in the high scores.
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, mb: 2 }}>
              <WarningIcon sx={{ mr: 1, color: 'warning.main' }} />
              <Typography variant="h6" component="h3">
                Important Notes
              </Typography>
            </Box>
            <List>
              <ListItem>
                <ListItemIcon>
                  <WarningIcon color="warning" />
                </ListItemIcon>
                <ListItemText primary="This version of Battleship does not update in real-time" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <WarningIcon color="warning" />
                </ListItemIcon>
                <ListItemText primary="You must refresh the page to see your opponent's moves" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <WarningIcon color="warning" />
                </ListItemIcon>
                <ListItemText primary="Only join games that do not already have two players" />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TipsAndUpdatesIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h5" component="h2">
                Tips for Success
              </Typography>
            </Box>
            <List>
              <ListItem>
                <ListItemIcon>
                  <TipsAndUpdatesIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="When you get a hit, try targeting adjacent cells to find the rest of the ship" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <TipsAndUpdatesIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Ships can only be placed horizontally or vertically, not diagonally" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <TipsAndUpdatesIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Target the center of the board first, as more ships tend to be placed there" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <TipsAndUpdatesIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="If waiting for an opponent, you can challenge the AI for a quick game" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body2" color="text.secondary">
          Happy hunting! May the best admiral win.
        </Typography>
      </Box>
    </Container>
  );
};

export default Rules; 