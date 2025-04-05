const { DataTypes } = require("sequelize");
const connection = require("../config/database.js");

const review = connection.define(
  "review",
  {
    id: {
      type: DataTypes.BIGINT({ unsigned: true }),
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    ratings: {
      type: DataTypes.FLOAT(),
    },
    userId: {
      type: DataTypes.BIGINT({ unsigned: true, zerofill: false }),
      allowNull: false,
    },
    productId: {
      type: DataTypes.BIGINT({ unsigned: true, zerofill: false }),
      allowNull: false,
    },
  },
  { timestamps: true }
);

module.exports = review;
