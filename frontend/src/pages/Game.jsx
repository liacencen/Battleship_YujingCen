import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Button, 
  CircularProgress,
  Alert,
  Snackbar,
  Divider
} from '@mui/material';
import axios from 'axios';

// Board cell component
const Cell = ({ value, onClick, isUserBoard, isHit, isMiss, disabled }) => {
  const getBackgroundColor = () => {
    if (isHit) return '#e57373'; // Red for hit
    if (isMiss) return '#e0e0e0'; // Gray for miss
    if (value && isUserBoard) return '#64b5f6'; // Blue for user's ships
    return '#ffffff'; // White for empty cells
  };

  return (
    <Box
      onClick={disabled ? undefined : onClick}
      sx={{
        width: '30px',
        height: '30px',
        border: '1px solid #90a4ae',
        backgroundColor: getBackgroundColor(),
        cursor: disabled ? 'default' : 'pointer',
        '&:hover': {
          opacity: disabled ? 1 : 0.8,
          boxShadow: disabled ? 'none' : '0px 0px 5px rgba(0, 0, 0, 0.3)'
        },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'background-color 0.2s, opacity 0.2s, box-shadow 0.2s'
      }}
    >
      {isHit && value && '✓'}
      {isMiss && '×'}
    </Box>
  );
};

// Game board component
const Board = ({ board, hits, misses, onCellClick, isUserBoard, disabled }) => {
  return (
    <Box sx={{ display: 'inline-block' }}>
      <Grid container spacing={0}>
        {Array(10).fill().map((_, rowIndex) => (
          <Grid container item key={rowIndex}>
            {Array(10).fill().map((_, colIndex) => (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                value={board ? board[rowIndex][colIndex] : null}
                isHit={hits && hits[rowIndex][colIndex]}
                isMiss={misses && misses[rowIndex][colIndex]}
                onClick={() => onCellClick(rowIndex, colIndex)}
                isUserBoard={isUserBoard}
                disabled={disabled || (isUserBoard && true) || (hits && hits[rowIndex][colIndex]) || (misses && misses[rowIndex][colIndex])}
              />
            ))}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const Game = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loadingMove, setLoadingMove] = useState(false);

  // Function to refresh game data
  const fetchGameData = useCallback(async () => {
    try {
      const gameResponse = await axios.get(`/api/games/${gameId}`);
      setGame(gameResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching game:', error);
      setError('Failed to load game data. Please try again.');
      setLoading(false);
    }
  }, [gameId]);

  // Check if logged in and fetch game data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to get current user (if logged in)
        try {
          const userResponse = await axios.get('/api/users/me');
          setUser(userResponse.data);
        } catch (err) {
          // Not logged in, continue as visitor
          setUser(null);
        }

        // Fetch game data
        await fetchGameData();
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchGameData]);

  // Handle AI move if it's AI's turn
  useEffect(() => {
    const handleAIMove = async () => {
      if (game && game.isAIGame && game.currentTurn === 'ai' && game.status === 'active') {
        try {
          setLoadingMove(true);
          await axios.post(`/api/games/${gameId}/ai-move`);
          await fetchGameData();
          setLoadingMove(false);
        } catch (error) {
          console.error('Error with AI move:', error);
          setLoadingMove(false);
        }
      }
    };

    if (game && game.isAIGame && game.currentTurn === 'ai' && game.status === 'active') {
      const timer = setTimeout(() => {
        handleAIMove();
      }, 1000); // Add a delay to make AI moves feel more natural

      return () => clearTimeout(timer);
    }
  }, [game, gameId, fetchGameData]);

  // Handle cell click (making a move)
  const handleCellClick = async (row, col) => {
    if (!user) {
      setMessage('Please login to play');
      setOpenSnackbar(true);
      return;
    }

    if (loadingMove) {
      return;
    }

    if (!game || game.status !== 'active') {
      return;
    }

    if (game.currentTurn !== user._id) {
      setMessage("It's not your turn");
      setOpenSnackbar(true);
      return;
    }

    try {
      setLoadingMove(true);
      const response = await axios.put(`/api/games/${gameId}/move`, { row, col });
      setMessage(response.data.message);
      setOpenSnackbar(true);
      await fetchGameData();
      setLoadingMove(false);
    } catch (error) {
      console.error('Error making move:', error);
      setMessage(error.response?.data?.message || 'Error making move');
      setOpenSnackbar(true);
      setLoadingMove(false);
    }
  };

  // Handle joining a game
  const handleJoinGame = async () => {
    if (!user) {
      setMessage('Please login to join the game');
      setOpenSnackbar(true);
      return;
    }

    try {
      await axios.put(`/api/games/${gameId}/join`);
      await fetchGameData();
      setMessage('Joined game successfully');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error joining game:', error);
      setMessage(error.response?.data?.message || 'Error joining game');
      setOpenSnackbar(true);
    }
  };

  // Handle challenging AI
  const handleChallengeAI = async () => {
    if (!user) {
      setMessage('Please login to challenge AI');
      setOpenSnackbar(true);
      return;
    }

    try {
      await axios.put(`/api/games/${gameId}/challenge-ai`);
      await fetchGameData();
      setMessage('AI opponent added');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error challenging AI:', error);
      setMessage(error.response?.data?.message || 'Error challenging AI');
      setOpenSnackbar(true);
    }
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          onClick={() => navigate('/games')}
        >
          Back to Games
        </Button>
      </Container>
    );
  }

  if (!game) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="warning">Game not found</Alert>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          onClick={() => navigate('/games')}
        >
          Back to Games
        </Button>
      </Container>
    );
  }

  // Determine if current user is player1, player2, or spectator
  const isPlayer1 = user && game.player1.id === user._id;
  const isPlayer2 = user && game.player2 && game.player2.id === user._id;
  const isParticipant = isPlayer1 || isPlayer2;
  const isSpectator = !isParticipant;

  // Get user's board
  const userBoard = isPlayer1 ? game.player1.board : isPlayer2 ? game.player2.board : null;
  const userHits = isPlayer1 ? game.player1.hits : isPlayer2 ? game.player2.hits : null;
  const userMisses = isPlayer1 ? game.player1.misses : isPlayer2 ? game.player2.misses : null;

  // Get opponent's board
  const opponentBoard = isPlayer1 ? (game.player2 ? game.player2.board : null) : game.player1.board;
  const opponentHits = isPlayer1 
    ? (game.player2 ? game.player2.hits : null) 
    : (isPlayer2 ? game.player1.hits : null);
  const opponentMisses = isPlayer1 
    ? (game.player2 ? game.player2.misses : null) 
    : (isPlayer2 ? game.player1.misses : null);

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  };

  // Game status text
  const getStatusText = () => {
    if (game.status === 'open') {
      return 'Waiting for opponent';
    }
    
    if (game.status === 'active') {
      if (isParticipant) {
        const isUserTurn = game.currentTurn === user._id;
        return isUserTurn ? 'Your turn' : "Opponent's turn";
      }
      return `Current turn: ${
        game.currentTurn === game.player1.id ? game.player1.username : game.player2.username
      }`;
    }
    
    if (game.status === 'completed') {
      const winnerName = game.winner === game.player1.id 
        ? game.player1.username 
        : game.player2.username;
      
      if (isParticipant) {
        const userWon = game.winner === user._id;
        return userWon ? 'You won!' : 'You lost';
      }
      
      return `${winnerName} wins!`;
    }
    
    return 'Unknown status';
  };

  // Get background color based on game status
  const getStatusColor = () => {
    if (game.status === 'open') return 'info.light';
    if (game.status === 'active') {
      if (isParticipant && game.currentTurn === user._id) {
        return 'primary.light';
      }
      return 'primary.light';
    }
    if (game.status === 'completed') {
      if (isParticipant) {
        return game.winner === user._id ? 'success.light' : 'error.light';
      }
      return 'info.light';
    }
    return 'grey.300';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Game header */}
      <Paper sx={{ p: 3, mb: 4, backgroundColor: getStatusColor() }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Battleship Game
        </Typography>
        <Typography variant="h5" align="center" sx={{ fontWeight: 'bold' }}>
          {getStatusText()}
        </Typography>
        
        {game.status === 'completed' && (
          <Typography variant="body1" align="center">
            Winner: {game.winner === game.player1.id ? game.player1.username : game.player2.username}
          </Typography>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Typography variant="body2">
            Game ID: {game._id}
          </Typography>
          <Typography variant="body2">
            Started: {formatDate(game.startTime)}
          </Typography>
          {game.endTime && (
            <Typography variant="body2">
              Ended: {formatDate(game.endTime)}
            </Typography>
          )}
        </Box>
      </Paper>

      {/* Game actions */}
      {!isParticipant && game.status === 'open' && user && (
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleJoinGame}
            disabled={loadingMove}
          >
            Join Game
          </Button>
        </Box>
      )}
      
      {isPlayer1 && game.status === 'open' && (
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleChallengeAI}
            disabled={loadingMove}
          >
            Challenge AI
          </Button>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Waiting for an opponent to join, or challenge the AI
          </Typography>
        </Box>
      )}

      {/* Player information */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">
              Player 1: {game.player1.username}
              {isPlayer1 && ' (You)'}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">
              Player 2: {game.player2 ? `${game.player2.username}${isPlayer2 ? ' (You)' : ''}` : 'Waiting for opponent'}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Login prompt for non-logged in users */}
      {!user && (
        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="body1">
            Please <Link to="/login">login</Link> to join or play games
          </Typography>
        </Alert>
      )}

      {/* Loading indicator during moves */}
      {loadingMove && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <CircularProgress size={24} />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Processing move...
          </Typography>
        </Box>
      )}

      {/* Game boards */}
      {game.status !== 'open' && (
        <Grid container spacing={4}>
          {/* Opponent's board */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {isPlayer1
                  ? `${game.player2 ? game.player2.username : 'Opponent'}'s Board`
                  : `${game.player1.username}'s Board`}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Board
                  board={
                    // Only show opponent's board if game is completed or user is a spectator
                    game.status === 'completed' || !isParticipant ? opponentBoard : null
                  }
                  hits={isParticipant ? userHits : opponentHits}
                  misses={isParticipant ? userMisses : opponentMisses}
                  onCellClick={handleCellClick}
                  isUserBoard={false}
                  disabled={
                    !user || 
                    game.status !== 'active' || 
                    !isParticipant || 
                    game.currentTurn !== user._id
                  }
                />
              </Box>
            </Paper>
          </Grid>

          {/* User's board */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {isPlayer1
                  ? `${game.player1.username}'s Board`
                  : isPlayer2
                  ? `${game.player2.username}'s Board`
                  : `${game.player2 ? game.player2.username : 'Opponent'}'s Board`}
                {isParticipant && ' (Your Board)'}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Board
                  board={
                    // Always show user's board if user is participant
                    isParticipant || game.status === 'completed' ? userBoard : null
                  }
                  hits={isParticipant ? opponentHits : userHits}
                  misses={isParticipant ? opponentMisses : userMisses}
                  onCellClick={() => {}}
                  isUserBoard={true}
                  disabled={true}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Bottom actions */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/games')}
          sx={{ mx: 1 }}
        >
          Back to Games
        </Button>
      </Box>

      {/* Snackbar for messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={message}
      />
    </Container>
  );
};

export default Game; 