const { DataTypes } = require("sequelize");
const connection = require("../config/database.js");

const cart = connection.define(
  "cart",
  {
    id: {
      type: DataTypes.BIGINT({ unsigned: true, zerofill: false }),
      autoIncrement: true,
      primaryKey: true,
    },
    totalCartPrice: {
      type: DataTypes.FLOAT(),
      allowNull: false,
      defaultValue: 0,
    },
    totalPriceAfterDiscount: {
      type: DataTypes.FLOAT(),
      allowNull: false,
      defaultValue: 0,
    },
    userId: {
      type: DataTypes.BIGINT({ unsigned: true, zerofill: false }),
      allowNull: false,
    },
  },
  { timestamps: true }
);

module.exports = cart;
