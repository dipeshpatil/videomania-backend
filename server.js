require("dotenv").config({ path: "./.env" });

const fs = require("fs");
const express = require("express");
const path = require("path");

const connectDatabase = require("./config/database");
const constants = require("./config/constants.json");

const app = express();

const { cleanUpExpiredLinks } = require("./utils/common");

// MongoDB Connection
connectDatabase();

// Importing Video Route
const videoRoute = require("./routes/video");
// Importing Auth Route
const authRoute = require("./routes/auth");
// Importing User Route
const userRoute = require("./routes/user");
// Importing Transaction Route
const transactionRoute = require("./routes/transaction");
// Importing Plan Route
const planRoute = require("./routes/plan");

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
app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/transaction", transactionRoute);
app.use("/plan", planRoute);

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
