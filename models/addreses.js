const { DataTypes } = require("sequelize");
const connection = require("../config/database.js");

const Addreses = connection.define("Addreses", {
  id: {
    type: DataTypes.BIGINT({ unsigned: true, zerofill: false }),
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.BIGINT({ unsigned: true, zerofill: false }),
    allowNull: false,
  },
  alias: {
    type: DataTypes.STRING(),
    allowNull: false,
  },
  details : {
    type: DataTypes.STRING(),
    allowNull: false,
  },
  city : {
    type: DataTypes.STRING(),
    allowNull: false,
  },
  postCode : {
    type: DataTypes.STRING(),
    allowNull: false,
  },
    phone : {
    type: DataTypes.STRING(),
    allowNull: false,
  },
});

module.exports = Addreses;
