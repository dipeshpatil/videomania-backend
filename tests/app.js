const fs = require('fs');
const express = require('express');
const path = require('path');
const multer = require('multer');

const sequelize = require('../config/database');
const constants = require('../config/constants.json');

const app = express();

// Importing Video Route
const videoRoute = require('../routes/video');

app.use(express.json({ extended: false }));

// Creating uploads/ folder to store output videos
const uploadsPath = path.join(path.dirname(require.main.filename), constants.app.outputDirectory);
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
}

app.use('/uploads', express.static(uploadsPath));

// Registering URL Route
app.use('/video', videoRoute);

module.exports = app;
