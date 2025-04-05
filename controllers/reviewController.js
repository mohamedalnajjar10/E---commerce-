const review = require("../models/review.js");
const factory = require("./handelrsFactory.js");

//Nested Route
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObj = filterObject;
  next();
};

exports.getreviews = factory.getAll(review);

//Nested Route (create) 
exports.setProductIdAndUserIdToBody = (req , res ,next) => {
    if (! req.body.productId) req.body.productId = req.params.productId ;
    if (! req.body.userId) req.body.userId = req.params.userId ;

    next()
  };

exports.createreview = factory.createOne(review);

exports.getreview = factory.getOne(review);

exports.updatereview = factory.updateOne(review);

exports.deletereview = factory.deleteOne(review);
