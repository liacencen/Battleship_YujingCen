import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

const HighScores = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to get current user (if logged in)
        try {
          const userResponse = await axios.get('/api/users/me');
          setCurrentUser(userResponse.data);
        } catch (err) {
          // Not logged in, continue
        }

        // Get high scores
        const scoresResponse = await axios.get('/api/users/scores');
        setScores(scoresResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching high scores:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ my: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        High Scores
      </Typography>
      
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Rank</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Player</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Wins</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Losses</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Win Rate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scores.map((player, index) => {
              const totalGames = player.wins + player.losses;
              const winRate = totalGames > 0 
                ? ((player.wins / totalGames) * 100).toFixed(1) 
                : '0.0';
              
              const isCurrentUser = currentUser && player._id === currentUser._id;
              
              return (
                <TableRow 
                  key={player._id}
                  sx={{ 
                    '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                    ...(isCurrentUser && { 
                      backgroundColor: 'rgba(25, 118, 210, 0.08)',
                      '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.12)' }
                    })
                  }}
                >
                  <TableCell>
                    {index === 0 ? (
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'gold' }}>
                        {index + 1}
                      </Typography>
                    ) : index === 1 ? (
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'silver' }}>
                        {index + 1}
                      </Typography>
                    ) : index === 2 ? (
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'brown' }}>
                        {index + 1}
                      </Typography>
                    ) : (
                      index + 1
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        fontWeight: isCurrentUser ? 'bold' : 'regular',
                        color: isCurrentUser ? 'primary.main' : 'inherit'
                      }}
                    >
                      {player.username}
                      {isCurrentUser && ' (You)'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">{player.wins}</TableCell>
                  <TableCell align="center">{player.losses}</TableCell>
                  <TableCell align="center">{winRate}%</TableCell>
                </TableRow>
              );
            })}
            
            {scores.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No scores available yet. Start playing to see scores here!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default HighScores; 