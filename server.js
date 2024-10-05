const express = require("express");

const config = require("./config/constants.json");

const app = express();

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
