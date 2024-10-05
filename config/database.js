// config/database.js
const { Sequelize } = require("sequelize");

// Create a new Sequelize instance for SQLite
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite", // Path to the SQLite file
  logging: false, // Set to true if you want SQL queries logged
});

module.exports = sequelize;
