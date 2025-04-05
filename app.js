const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const connection = require("./config/database.js");
const globalError = require("./middlewares/errorMiddleware.js");
const ApiError = require("./utils/ApiError.js");
const wishList = require("./models/wishlist.js");
const product = require("./models/product.js");
const brand = require("./models/brand.js");
const user = require("./models/user.js");
const review = require("./models/review.js");
const category = require("./models/categories.js");
const subCategory = require("./models/subCategory");
const cart = require("./models/cart.js");
const cartItems = require("./models/cartItems.js");
const order = require("./models/order.js");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const mountRoute = require("./routes/index.js");
const Addreses = require("./models/addreses.js");


const app = express();

// Enable other domains to access your application
app.use(cors());
app.options("*", cors()); // include before other routes

// compress all responses
app.use(compression());

app.use(express.json({ limit: "20kb" })); //parsing
app.use(express.static(path.join(__dirname, "uploads")));

//Relations
category.hasMany(subCategory, {
  foreignKey: "categoryId",
  onDelete: "CASCADE",
});

subCategory.belongsTo(category, { foreignKey: "categoryId" });

brand.hasMany(product, { foreignKey: "brandId", onDelete: "CASCADE" });

product.belongsTo(brand, { foreignKey: "brandId" });

subCategory.hasMany(product, { foreignKey: "subCategoryId" });

product.belongsTo(subCategory, { foreignKey: "subCategoryId" });

category.hasMany(product, { foreignKey: "categoryId" });

product.belongsTo(category, { foreignKey: "categoryId" });

user.hasMany(review, { foreignKey: "userId", onDelete: "CASCADE" });

review.belongsTo(user, { foreignKey: "userId" });

product.hasMany(review, { foreignKey: "productId", onDelete: "CASCADE" });

review.belongsTo(product, { foreignKey: "productId" });

user.belongsToMany(product, {
  through: { model: "wishList", unique: false },
  foreignKey: "userId",
});

product.belongsToMany(user, {
  through: { model: "wishList", unique: false },
  foreignKey: "productId",
});

user.hasMany(wishList, { foreignKey: "userId" });

wishList.belongsTo(user, { foreignKey: "userId" });

wishList.belongsTo(product, { foreignKey: "productId" });

user.hasMany(cart, { foreignKey: "userId", onDelete: "CASCADE" });

cart.belongsTo(user, { foreignKey: "userId" });

Addreses.belongsTo(user, { foreignKey: "userId" });

user.belongsTo(Addreses , {foreignKey : "userId"});

user.hasMany(cart, { foreignKey: "userId" });

cart.belongsTo(user, { foreignKey: "userId" });

cart.hasMany(cartItems, { as: "cartItems", foreignKey: "cartId" });

cartItems.belongsTo(cart, { foreignKey: "cartId" });

product.hasMany(cartItems, { foreignKey: "productId" });

cartItems.belongsTo(product, { foreignKey: "productId" });

user.hasMany(order, { foreignKey: "userId", onDelete: "CASCADE" });

order.belongsTo(user, { foreignKey: "userId" });

cartItems.hasMany(order, { foreignKey: "cartItemsId", onDelete: "CASCADE" });

order.belongsTo(cartItems, { foreignKey: "cartItemsId" });

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  message: "Too many requests, please try again later.",
});
// Apply the rate limiting middleware to all requests.
app.use("/api", limiter);

//middleware to protect against HTTP Parameter Pollution attacks
app.use(
  hpp({
    whitelist: [
      "price",
      "sold",
      "quantity",
      "ratingsAverage",
      "ratingsQuantity",
    ],
  })
);

//Routs
mountRoute(app);

app.all("*", (req, res, next) => {
  next(new ApiError(`Cant find this router : ${req.originalUrl}`, 400));
  // send errors to middelware
  next(err.message);
});

// Global error handling middleware for express
app.use(globalError);

connection.sync({ force: false }).then(() => {
  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`App running running on port ${PORT}`);
  });
});

// Event => Listen => callback (err)
// Handle rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  process.exit(1);
});
