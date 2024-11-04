const secrets = require(`../secrets/${process.env.APP_ENV}.json`);

module.exports = {
  dbConfig: secrets.db,
  redisConfig: secrets.redis,
  s3Config: secrets.s3,
  appConfig: secrets.app,
  creditConfig: secrets.credits,
};
