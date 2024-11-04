const redisClient = require("../config/redis");

const isTokenBlacklisted = async (token) => {
  try {
    const result = await redisClient.get(`blacklist:${token}`);
    return result === "blacklisted";
  } catch (err) {
    console.error("Failed to check token in Redis blacklist:", err);
    return false;
  }
};

const addToBlacklist = async (token, expiryTime) => {
  try {
    await redisClient.setEx(`blacklist:${token}`, expiryTime, "blacklisted");
    console.log(`Token blacklisted ExpiryTime: ${expiryTime} seconds.`);
  } catch (err) {
    console.error("Failed to add token to Redis blacklist:", err);
  }
};

module.exports = { isTokenBlacklisted, addToBlacklist };
