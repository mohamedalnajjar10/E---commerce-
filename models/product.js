const { DataTypes } = require("sequelize");
const connection = require("../config/database.js");

const product = connection.define(
  "product",
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
    slug: {
      type: DataTypes.STRING(),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT(),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER(),
      allowNull: false,
    },
    sold: {
      type: DataTypes.INTEGER(),
      defaultValue: 0,
    },
    price: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: false,
    },
    priceAfterDiscount: {
      type: DataTypes.DECIMAL(10, 3),
    },
    colors: {
      type: DataTypes.JSON(),
      defaultValue: [],
    },
    imageCover: {
      type: DataTypes.STRING(),
      allowNull: false,
      get() {
        const rawValue = this.getDataValue("imageCover");
        if (rawValue) {
          return `${process.env.BASE_URL}/products/${rawValue}`;
        }
        return rawValue;
      },
    },
    images: {
      type: DataTypes.JSON(),
      defaultValue: [],
      get() {
        const rawValue = this.getDataValue("images");
        if (rawValue) {
          return `${process.env.BASE_URL}/products/${rawValue}`;
        }
        return rawValue;
      },
    },
    ratingsAverage: {
      type: DataTypes.FLOAT(),
    },
    ratingsQuantity: {
      type: DataTypes.INTEGER(),
      defaultValue: 0,
    },
    categoryId: {
      type: DataTypes.BIGINT({ unsigned: true, zerofill: false }),
      allowNull: false,
    },
    subCategoryId: {
      type: DataTypes.BIGINT({ unsigned: true, zerofill: false }),
      allowNull: false,
    },
    brandId: {
      type: DataTypes.BIGINT({ unsigned: true, zerofill: false }),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    paranoid: false, // لتمكين الحذف الناعم (soft delete)
  }
);

module.exports = product;
