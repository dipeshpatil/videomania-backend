const express = require("express");
const sequelize = require("./config/database");
const config = require("./config/constants.json");

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

// Registering URL Route
app.use("/video", videoRoute);

// Server Running on PORT
const { PORT } = config;
app.listen(PORT, function () {
  console.log(`Server Running on PORT: ${PORT}`);
});
