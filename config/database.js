const mongoose = require("mongoose");

const { dbConfig } = require("./secrets");

const connectDatabase = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}/${dbConfig.databaseName}?retryWrites=true&w=majority&appName=${dbConfig.appName}`
    );
    console.log("Mongo DB Connected");
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = connectDatabase;
