const product = require("../models/product.js");
const factory = require("./handelrsFactory.js");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const { uploadMixOfImages } = require('../middlewares/uploadImageMiddleware.js');


exports.uploadProductImages  = uploadMixOfImages([
  {
    name: 'imageCover',
    maxCount: 1,
  },
  {
    name: 'images',
    maxCount: 5,
  },
]);

exports.reSizeProductImage = async (req, res, next) => {
  //images processing for imageCover
  const imageCoverFileName = `product-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat("jpeg")
    .jpeg({ quality: 80 })
    .toFile(`uploads/products/${imageCoverFileName}`);
  req.body.imageCover = imageCoverFileName;

  //images processing for images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}${index + 1}.jpeg`;
        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 80 })
          .toFile(`uploads/products/${imageName}`);
        req.body.images.push(imageName);
      })
    );
  }
  next();
};

exports.getProducts = factory.getAll(product);

exports.createProduct = factory.createOne(product);

exports.getProduct = factory.getOne(product);

exports.updateProduct = factory.updateOne(product);

exports.deleteProduct = factory.deleteOne(product);
