const fs = require("fs");
const express = require("express");
const path = require("path");

const sequelize = require("./config/database");
const constants = require("./config/constants.json");

const app = express();

sequelize
  .sync({ force: false }) // force: false prevents dropping tables, set to true for dev
  .then(() => {
    console.log("Database synced successfully.");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

// Importing URL Route
const videoRoute = require("./routes/video");

app.use(express.json({ extended: false }));

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
