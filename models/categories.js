const { DataTypes } = require("sequelize");
const connection = require("../config/database.js");

const category = connection.define(
  "category",
  {
    id: {
      type: DataTypes.BIGINT({ unsigned: true, zerofill: false }),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,

      unique: [true, "subCategory must be unique "],
    },
    image: {
      type: DataTypes.STRING(),
      get() {
        const rawValue = this.getDataValue("image");
        if (rawValue) {
          return `${process.env.BASE_URL}/categories/${rawValue}`;
        }
        return rawValue;
      },
    },
    slug: {
      type: DataTypes.STRING(),
    },
  },
  { timestamps: true }
);

module.exports = category;
