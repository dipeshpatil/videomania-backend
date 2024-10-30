require("dotenv").config({ path: "./.env" });

const fs = require("fs");
const express = require("express");
const path = require("path");

const sequelize = require("./config/database");
const constants = require("./config/constants.json");

const app = express();

const { cleanUpExpiredLinks } = require("./utils/common");

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

// Registering URL Route
app.use("/video", videoRoute);

setInterval(async () => {
  await cleanUpExpiredLinks();
}, constants.app.expiredLinkFrequencyMinutes * 60 * 1000);

// Server Running on PORT
app.listen(constants.app.port, function () {
  console.log(`Server Running on PORT: ${constants.app.port}`);
  console.log(
    `Expired Links Set To Delete Every: ${constants.app.expiredLinkFrequencyMinutes} Minutes`
  );
});
