const { DataTypes } = require("sequelize");
const connection = require("../config/database.js");

const user = connection.define(
  "user",
  {
    id: {
      type: DataTypes.BIGINT({ unsigned: true }),
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(),
    },
    email: {
      type: DataTypes.STRING(),
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING(),
      allowNull: true,
      defaultValue: "",
    },
    profileImg: {
      type: DataTypes.STRING(),
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    passwordChangedAt: {
      type: DataTypes.DATE(),
    },
    passwordResetCode: {
      type: DataTypes.STRING(),
    },
    passwordResetExpires: {
      type: DataTypes.DATE(),
    },
    passwordResetVerified: {
      type: DataTypes.BOOLEAN(),
    },
    role: {
      type: DataTypes.ENUM("user", "manager", "admin"),
      defaultValue: "user",
    },
  },
  { timestamps: true }
);

module.exports = user;
