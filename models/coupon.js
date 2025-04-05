const { DataTypes } = require("sequelize");
const connection = require("../config/database.js");

const coupon = connection.define(
  "coupon",
  {
    id: {
        type: DataTypes.BIGINT({ unsigned: true, zerofill: false }),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
    name: {
      type: DataTypes.STRING(),
      allowNull: false,
    },
    expire: {
      type: DataTypes.DATE(),
    },
    discount : {
        type :DataTypes.FLOAT(),
    }
  },
  { timestamps: true }
);

module.exports = coupon;    
