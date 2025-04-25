import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import axios from 'axios';

// Set base URL for API requests
axios.defaults.baseURL = process.env.NODE_ENV === 'production' 
  ? '' // Empty string = same origin
  : 'http://localhost:8000';

// Include credentials in requests (for cookies)
axios.defaults.withCredentials = true;

// Create root and render App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 