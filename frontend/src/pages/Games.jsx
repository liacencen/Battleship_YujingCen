import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Button, 
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardActions,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';

const Games = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user info first
        let userData = null;
        try {
          const userResponse = await axios.get('/api/users/me');
          userData = userResponse.data;
          setUser(userData);
        } catch (err) {
          console.log('Not logged in');
        }

        // Fetch games
        const gamesResponse = await axios.get('/api/games');
        setGames(gamesResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleJoinGame = async (gameId) => {
    try {
      await axios.put(`/api/games/${gameId}/join`);
      navigate(`/game/${gameId}`);
    } catch (error) {
      console.error('Error joining game:', error);
    }
  };

  const handleChallengeAI = async (gameId) => {
    try {
      await axios.put(`/api/games/${gameId}/challenge-ai`);
      navigate(`/game/${gameId}`);
    } catch (error) {
      console.error('Error challenging AI:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ my: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  // Filter games by status and user participation
  const openGames = games.filter(game => 
    game.status === 'open' && 
    (!user || game.player1.id !== user._id)
  );
  
  // Only show these sections if user is logged in
  const myOpenGames = user ? games.filter(game => 
    game.status === 'open' && 
    game.player1.id === user._id
  ) : [];
  
  const myActiveGames = user ? games.filter(game => 
    game.status === 'active' && 
    (game.player1.id === user._id || (game.player2 && game.player2.id === user._id))
  ) : [];
  
  const myCompletedGames = user ? games.filter(game => 
    game.status === 'completed' && 
    (game.player1.id === user._id || (game.player2 && game.player2.id === user._id))
  ) : [];
  
  const otherGames = user ? games.filter(game => 
    (game.status === 'active' || game.status === 'completed') && 
    game.player1.id !== user._id && 
    (!game.player2 || game.player2.id !== user._id)
  ) : [];

  // If not logged in, just show all active and completed games
  const activeGames = !user ? games.filter(game => game.status === 'active') : [];
  const completedGames = !user ? games.filter(game => game.status === 'completed') : [];

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Battleship Games
      </Typography>

      {user ? (
        // Logged in view
        <Box sx={{ mt: 4 }}>
          {/* Open Games */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Open Games ({openGames.length})</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {openGames.length > 0 ? (
                <Grid container spacing={2}>
                  {openGames.map(game => (
                    <Grid item xs={12} sm={6} md={4} key={game._id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" component="div">
                            Game #{game._id.substring(0, 8)}
                          </Typography>
                          <Typography color="text.secondary">
                            Started by: {game.player1.username}
                          </Typography>
                          <Typography variant="body2">
                            Started: {formatDate(game.startTime)}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button 
                            size="small" 
                            component={Link} 
                            to={`/game/${game._id}`}
                          >
                            View
                          </Button>
                          <Button 
                            size="small" 
                            variant="contained" 
                            onClick={() => handleJoinGame(game._id)}
                          >
                            Join Game
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body1">No open games available to join.</Typography>
              )}
            </AccordionDetails>
          </Accordion>

          {/* My Open Games */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">My Open Games ({myOpenGames.length})</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {myOpenGames.length > 0 ? (
                <Grid container spacing={2}>
                  {myOpenGames.map(game => (
                    <Grid item xs={12} sm={6} md={4} key={game._id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" component="div">
                            Game #{game._id.substring(0, 8)}
                          </Typography>
                          <Typography variant="body2">
                            Started: {formatDate(game.startTime)}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button 
                            size="small" 
                            component={Link} 
                            to={`/game/${game._id}`}
                          >
                            View
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleChallengeAI(game._id)}
                          >
                            Challenge AI
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body1">You have no open games.</Typography>
              )}
            </AccordionDetails>
          </Accordion>

          {/* My Active Games */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">My Active Games ({myActiveGames.length})</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {myActiveGames.length > 0 ? (
                <Grid container spacing={2}>
                  {myActiveGames.map(game => (
                    <Grid item xs={12} sm={6} md={4} key={game._id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" component="div">
                            Game #{game._id.substring(0, 8)}
                          </Typography>
                          <Typography color="text.secondary">
                            Opponent: {
                              game.player1.id === user._id 
                                ? game.player2?.username 
                                : game.player1.username
                            }
                          </Typography>
                          <Typography variant="body2">
                            Started: {formatDate(game.startTime)}
                          </Typography>
                          <Typography variant="body2" color="primary">
                            Current Turn: {
                              game.currentTurn === user._id 
                                ? 'Your Turn' 
                                : 'Opponent\'s Turn'
                            }
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button 
                            size="small" 
                            variant="contained"
                            component={Link} 
                            to={`/game/${game._id}`}
                          >
                            Play
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body1">You have no active games.</Typography>
              )}
            </AccordionDetails>
          </Accordion>

          {/* My Completed Games */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">My Completed Games ({myCompletedGames.length})</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {myCompletedGames.length > 0 ? (
                <Grid container spacing={2}>
                  {myCompletedGames.map(game => {
                    const opponent = game.player1.id === user._id 
                      ? game.player2?.username 
                      : game.player1.username;
                    const isWinner = game.winner === user._id;
                    
                    return (
                      <Grid item xs={12} sm={6} md={4} key={game._id}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="h6" component="div">
                              Game #{game._id.substring(0, 8)}
                            </Typography>
                            <Typography color="text.secondary">
                              Opponent: {opponent}
                            </Typography>
                            <Typography variant="body2">
                              Started: {formatDate(game.startTime)}
                            </Typography>
                            <Typography variant="body2">
                              Ended: {formatDate(game.endTime)}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              color={isWinner ? 'success.main' : 'error.main'}
                              sx={{ fontWeight: 'bold' }}
                            >
                              Result: {isWinner ? 'You Won!' : 'You Lost'}
                            </Typography>
                          </CardContent>
                          <CardActions>
                            <Button 
                              size="small" 
                              component={Link} 
                              to={`/game/${game._id}`}
                            >
                              View
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              ) : (
                <Typography variant="body1">You have no completed games.</Typography>
              )}
            </AccordionDetails>
          </Accordion>

          {/* Other Games */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Other Games ({otherGames.length})</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {otherGames.length > 0 ? (
                <Grid container spacing={2}>
                  {otherGames.map(game => (
                    <Grid item xs={12} sm={6} md={4} key={game._id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" component="div">
                            Game #{game._id.substring(0, 8)}
                          </Typography>
                          <Typography color="text.secondary">
                            Players: {game.player1.username} vs. {game.player2?.username}
                          </Typography>
                          <Typography variant="body2">
                            Started: {formatDate(game.startTime)}
                          </Typography>
                          {game.status === 'completed' && (
                            <>
                              <Typography variant="body2">
                                Ended: {formatDate(game.endTime)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Winner: {
                                  game.player1.id === game.winner 
                                    ? game.player1.username 
                                    : game.player2?.username
                                }
                              </Typography>
                            </>
                          )}
                        </CardContent>
                        <CardActions>
                          <Button 
                            size="small" 
                            component={Link} 
                            to={`/game/${game._id}`}
                          >
                            View
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body1">No other games to display.</Typography>
              )}
            </AccordionDetails>
          </Accordion>
        </Box>
      ) : (
        // Logged out view
        <Box sx={{ mt: 4 }}>
          <Typography variant="body1" align="center" sx={{ mb: 4 }}>
            Please <Link to="/login">login</Link> or <Link to="/register">register</Link> to create and join games.
          </Typography>

          {/* Active Games */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Active Games ({activeGames.length})
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {activeGames.length > 0 ? (
              <List>
                {activeGames.map(game => (
                  <ListItem 
                    key={game._id}
                    component={Link}
                    to={`/game/${game._id}`}
                    sx={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <ListItemText
                      primary={`${game.player1.username} vs. ${game.player2?.username}`}
                      secondary={`Started: ${formatDate(game.startTime)}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1">No active games.</Typography>
            )}
          </Paper>

          {/* Completed Games */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Completed Games ({completedGames.length})
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {completedGames.length > 0 ? (
              <List>
                {completedGames.map(game => (
                  <ListItem 
                    key={game._id}
                    component={Link}
                    to={`/game/${game._id}`}
                    sx={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <ListItemText
                      primary={`${game.player1.username} vs. ${game.player2?.username}`}
                      secondary={`
                        Started: ${formatDate(game.startTime)} | 
                        Ended: ${formatDate(game.endTime)} | 
                        Winner: ${
                          game.player1.id === game.winner 
                            ? game.player1.username 
                            : game.player2?.username
                        }
                      `}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1">No completed games.</Typography>
            )}
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default Games; 