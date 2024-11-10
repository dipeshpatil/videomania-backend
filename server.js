require("dotenv").config({ path: "./.env" });

const fs = require("fs");
const express = require("express");
const path = require("path");
const cors = require("cors");

const {
  app: { outputDirectory, port, expiredLinkFrequencyMinutes },
} = require("./config/constants.json");
const connectDatabase = require("./config/database");
const { cleanUpExpiredLinks } = require("./utils/common");
const { applyRateLimiter, rateLimiter } = require("./middlewares/rate-limiter");

const videoRoute = require("./routes/video");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const transactionRoute = require("./routes/transaction");
const planRoute = require("./routes/plan");

const app = express();

// MongoDB Connection
connectDatabase();

// Creating uploads/ folder to store temp videos
if (!fs.existsSync(outputDirectory)) {
  fs.mkdirSync(outputDirectory);
}

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN, // Allow only your frontend origin
  })
);

app.use("/uploads", express.static(path.join(__dirname, outputDirectory)));

app.use(express.json({ extended: false }));

// Registering Routes
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
}, expiredLinkFrequencyMinutes * 60 * 1000);

// Server Running on PORT
app.listen(port, function () {
  console.log(`Server Running on PORT: ${port}`);
  console.log(
    `Expired Links Set To Delete Every: ${expiredLinkFrequencyMinutes} Minutes`
  );
});
