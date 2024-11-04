const redis = require("redis");

const { redisConfig } = require("./secrets");

let redisClient = null;

if (!redisClient) {
  redisClient = redis.createClient({
    url: `redis://${redisConfig.host}:${redisConfig.port}`,
    password: redisConfig.password || null,
  });

  redisClient.on("error", (err) => {
    console.error("Redis connection error: ", err.message);
  });

  redisClient.on("connect", () => {
    console.log(`Redis Connected on PORT: ${redisConfig.port}`);
  });
}

(async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error("Failed to connect to Redis: ", error.message);
  }
})();

module.exports = redisClient;
