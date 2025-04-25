import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Box,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import axios from 'axios';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/users/me');
        setUser(response.data);
      } catch (error) {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/api/users/logout');
      setUser(null);
      setAnchorEl(null);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleCreateGame = async () => {
    try {
      const response = await axios.post('/api/games');
      navigate(`/game/${response.data.gameId}`);
    } catch (error) {
      console.error('Create game error:', error);
    }
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuId = 'primary-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Games', path: '/games' },
    { name: 'High Scores', path: '/high-scores' },
    { name: 'Rules', path: '/rules' }
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Battleship
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.name} component={Link} to={item.path} button>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
        {user ? (
          <>
            <ListItem button onClick={handleCreateGame}>
              <ListItemText primary="New Game" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemText primary={`Logout (${user.username})`} />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem component={Link} to="/login" button>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem component={Link} to="/register" button>
              <ListItemText primary="Register" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <DirectionsBoatIcon sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ 
              flexGrow: 1, 
              textDecoration: 'none',
              color: 'inherit',
              display: { xs: 'none', sm: 'block' } 
            }}
          >
            Battleship
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex' }}>
              {navItems.map((item) => (
                <Button 
                  key={item.name}
                  component={Link}
                  to={item.path}
                  color="inherit"
                >
                  {item.name}
                </Button>
              ))}
              
              {user && (
                <Button 
                  color="inherit"
                  onClick={handleCreateGame}
                >
                  New Game
                </Button>
              )}
            </Box>
          )}

          {!isMobile && (
            <Box sx={{ display: 'flex' }}>
              {user ? (
                <>
                  <Button
                    color="inherit"
                    onClick={handleProfileMenuOpen}
                    aria-controls={menuId}
                    aria-haspopup="true"
                  >
                    {user.username}
                  </Button>
                </>
              ) : (
                <>
                  <Button color="inherit" component={Link} to="/login">
                    Login
                  </Button>
                  <Button color="inherit" component={Link} to="/register">
                    Register
                  </Button>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
      
      {renderMenu}
    </>
  );
};

export default Navbar; 