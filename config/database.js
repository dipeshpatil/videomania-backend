const { Sequelize } = require("sequelize");

const constants = require("../config/constants.json");

// Create a new Sequelize instance for SQLite
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: `./${constants.db.fileName}`, // Path to the SQLite file
  logging: false, // Set to true if you want SQL queries logged
});

module.exports = sequelize;
