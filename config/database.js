const mongoose = require("mongoose");

const { db } = require("../secrets/development.json");

const connectDatabase = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${db.username}:${db.password}@${db.host}/${db.databaseName}?retryWrites=true&w=majority&appName=${db.appName}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Mongo DB Connected");
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = connectDatabase;
