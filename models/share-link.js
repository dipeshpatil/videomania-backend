const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ShareableLink = sequelize.define("ShareableLink", {
  videoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Videos",
      key: "id",
    },
  },
  link: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  expiryTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

module.exports = ShareableLink;
