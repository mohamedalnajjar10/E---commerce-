const { DataTypes } = require("sequelize");
const connection = require("../config/database.js");

const wishList = connection.define("wishList", {
  id: {
    type: DataTypes.BIGINT({ unsigned: true, zerofill: false }),
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.BIGINT({ unsigned: true, zerofill: false }),
    allowNull: false,
  },
  productId: {
    type: DataTypes.BIGINT({ unsigned: true, zerofill: false }),
    allowNull: false,
  },
});

module.exports = wishList;
