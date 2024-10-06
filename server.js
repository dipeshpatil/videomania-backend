require("dotenv").config({ path: "./.env" });

const fs = require("fs");
const express = require("express");
const path = require("path");

const sequelize = require("./config/database");
const constants = require("./config/constants.json");

const app = express();

// Init DB Connection
sequelize
  .sync({ force: false }) // force: false prevents dropping tables, set to true for dev
  .then(() => {
    console.log("Database synced successfully.");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

// Importing Video Route
const videoRoute = require("./routes/video");

app.use(express.json({ extended: false }));

// Creating uploads/ folder to store output videos
if (!fs.existsSync(constants.app.outputDirectory)) {
  fs.mkdirSync(constants.app.outputDirectory);
}

app.use(
  "/uploads",
  express.static(path.join(__dirname, constants.app.outputDirectory))
);

// Registering URL Route
app.use("/video", videoRoute);

// Server Running on PORT
app.listen(constants.app.port, function () {
  console.log(`Server Running on PORT: ${constants.app.port}`);
});
