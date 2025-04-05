const { DataTypes } = require("sequelize");
const connection = require("../config/database.js");
const subCategory = connection.define(
  "subCategory",
  {
    id: {
      type: DataTypes.BIGINT({ unsigned: true }),
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: [true, "subCategory must be unique "],
    },
    slug: {
      type: DataTypes.STRING(),
    },
    categoryId: {
      type: DataTypes.BIGINT({ unsigned: true, zerofill: false }),
      allowNull: false,
    },
  },
  { timestamps: true }
);

module.exports = subCategory;
