require("dotenv").config({ path: "./.env" });

const fs = require("fs");
const express = require("express");
const path = require("path");

const RateLimiter = require("./utils/rate-limiter");
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

const { applyRateLimiter } = require("./middlewares/rate-limiter");

app.use(express.json({ extended: false }));

// Creating uploads/ folder to store output videos
if (!fs.existsSync(constants.app.outputDirectory)) {
  fs.mkdirSync(constants.app.outputDirectory);
}

app.use(
  "/uploads",
  express.static(path.join(__dirname, constants.app.outputDirectory))
);

const rateLimiter = {
  video: new RateLimiter(3, 1, 10),
  auth: new RateLimiter(5, 1, 5),
  user: new RateLimiter(3, 1, 5),
  transaction: new RateLimiter(3, 1, 5),
  plan: new RateLimiter(3, 1, 10),
};

// Registering URL Route
app.use("/video", [applyRateLimiter(rateLimiter.video)], videoRoute);
app.use("/auth", [applyRateLimiter(rateLimiter.auth)], authRoute);
app.use("/user", [applyRateLimiter(rateLimiter.user)], userRoute);
app.use(
  "/transaction",
  [applyRateLimiter(rateLimiter.transaction)],
  transactionRoute
);
app.use("/plan", [applyRateLimiter(rateLimiter.plan)], planRoute);

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
