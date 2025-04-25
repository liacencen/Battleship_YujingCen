const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

// Import routes
const gameRoutes = require('./apis/game');
const userRoutes = require('./apis/user');

// MongoDB connection
const mongoDBEndpoint = process.env.MONGO || 'your_mongodb_uri';
mongoose.connect(mongoDBEndpoint, { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API routes
app.use('/api/games/', gameRoutes);
app.use('/api/users/', userRoutes);

// Serve static files from frontend
let frontend_dir = path.join(__dirname, '..', 'frontend', 'dist');

app.use(express.static(frontend_dir));
app.get('*', function (req, res) {
    console.log("received request");
    res.sendFile(path.join(frontend_dir, "index.html"));
});

// Start server
app.listen(process.env.PORT || 8000, function() {
    console.log("Starting server now...");
}); 