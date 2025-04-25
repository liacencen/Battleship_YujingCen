import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Container, 
  Paper, 
  Alert,
  LinearProgress
} from '@mui/material';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const navigate = useNavigate();

  // Password validation rules
  const validatePassword = (pass) => {
    const errors = [];
    const strength = {
      length: pass.length >= 8,
      capital: /[A-Z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[!@#$%^&*]/.test(pass)
    };

    if (!strength.length) errors.push('Password must be at least 8 characters long');
    if (!strength.capital) errors.push('Include at least one capital letter');
    if (!strength.number) errors.push('Include at least one number');
    if (!strength.special) errors.push('Include at least one special character (!@#$%^&*)');

    setPasswordErrors(errors);
    
    // Calculate strength percentage
    const strengthScore = Object.values(strength).filter(Boolean).length;
    setPasswordStrength((strengthScore / 4) * 100);
  };

  useEffect(() => {
    // Check if user is already logged in
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('/api/users/me');
        if (response.data) {
          setIsLoggedIn(true);
          navigate('/');
        }
      } catch (err) {
        // Not logged in, stay on register page
      }
    };

    checkLoginStatus();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordErrors.length > 0) {
      setError('Please fix password requirements');
      return;
    }

    try {
      const response = await axios.post('/api/users/register', {
        username,
        password,
        confirmPassword
      });

      if (response.data) {
        // Registration successful, redirect to home
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  if (isLoggedIn) {
    return null; // Will be redirected by useEffect
  }

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Register
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value);
              }}
            />
            
            {/* Password strength indicator */}
            {password && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" color="textSecondary">
                  Password Strength:
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={passwordStrength} 
                  sx={{
                    mb: 1,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: 
                        passwordStrength <= 25 ? '#f44336' :
                        passwordStrength <= 50 ? '#ff9800' :
                        passwordStrength <= 75 ? '#2196f3' :
                        '#4caf50'
                    }
                  }}
                />
                {passwordErrors.map((error, index) => (
                  <Typography 
                    key={index} 
                    variant="caption" 
                    color="error" 
                    display="block"
                  >
                    • {error}
                  </Typography>
                ))}
              </Box>
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
            <Box textAlign="center">
              <Typography variant="body2">
                Already have an account?{' '}
                <Button 
                  color="primary" 
                  onClick={() => navigate('/login')}
                  sx={{ textTransform: 'none' }}
                >
                  Login here
                </Button>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register; 