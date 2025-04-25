import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Paper, 
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider
} from '@mui/material';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import axios from 'axios';

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/users/me');
        setUser(response.data);
      } catch (err) {
        // Not logged in
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  const handleCreateGame = async () => {
    try {
      const response = await axios.post('/api/games');
      navigate(`/game/${response.data.gameId}`);
    } catch (error) {
      console.error('Error creating game:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ 
        textAlign: 'center', 
        py: 4, 
        mb: 4, 
        backgroundColor: 'primary.main',
        borderRadius: 2,
        color: 'white'
      }}>
        <DirectionsBoatIcon sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h2" component="h1" gutterBottom>
          Battleship
        </Typography>
        <Typography variant="h5">
          The classic naval combat game
        </Typography>
      </Box>

      {user ? (
        // Logged in view
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Welcome back, {user.username}!
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
            <Button 
              variant="contained" 
              size="large"
              onClick={handleCreateGame}
            >
              New Game
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              onClick={() => navigate('/games')}
            >
              Browse Games
            </Button>
          </Box>
        </Paper>
      ) : (
        // Logged out view
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom align="center">
            Sign in to start playing!
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              onClick={() => navigate('/register')}
            >
              Register
            </Button>
          </Box>
        </Paper>
      )}

      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                Challenge Opponents
              </Typography>
              <Typography variant="body1">
                Create a new game and wait for opponents to join, or browse open games to find an opponent.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => navigate('/games')}>Browse Games</Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                Learn the Rules
              </Typography>
              <Typography variant="body1">
                New to Battleship? Check out the rules and learn how to play this classic naval combat game.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => navigate('/rules')}>View Rules</Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                High Scores
              </Typography>
              <Typography variant="body1">
                See how you stack up against other players. Check the leaderboard and climb to the top!
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => navigate('/high-scores')}>View Scores</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 6, mb: 4, textAlign: 'center' }}>
        <Divider sx={{ mb: 4 }} />
        <Typography variant="body2" color="text.secondary">
          Battleship &copy; {new Date().getFullYear()} - All rights reserved
        </Typography>
      </Box>
    </Container>
  );
};

export default Home; 