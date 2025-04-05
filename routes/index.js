const categoryRoute = require("./categoryRoute.js");
const subCategoryRoute = require("./subCategoryRoute.js");
const brandRoute = require("./brandRoute.js");
const productRoute = require("./productRoute.js");
const userRoute = require("./userRoute.js");
const authRoute = require("./authRoute.js");
const reviewRoute = require("./reviewRoute.js");
const wishListRoute = require("./wishListRoute.js");
const couponRoute = require("./couponRoute.js");
const addresesRoute = require("./addresesRoute.js");
const cartRoute = require("./cartRoute.js");
const orderRoute = require("./orderRoute.js");

const mountRoute = (app) => {
  app.use("/api/v1/categories", categoryRoute);
  app.use("/api/v1/subcategories", subCategoryRoute);
  app.use("/api/v1/brands", brandRoute);
  app.use("/api/v1/products", productRoute);
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/reviews", reviewRoute);
  app.use("/api/v1/wishList", wishListRoute);
  app.use("/api/v1/addresses", addresesRoute);
  app.use("/api/v1/coupons", couponRoute);
  app.use("/api/v1/cart", cartRoute);
  app.use("/api/v1/orders", orderRoute);
};

module.exports = mountRoute;
