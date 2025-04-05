const brand = require("../models/brand.js");
const factory = require ("./handelrsFactory.js");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const {uploadSingleImage} = require ("../middlewares/uploadImageMiddleware.js");

exports.uploadBrandImage = uploadSingleImage('image');

exports.reSizeImage = async(req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
 await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 80 })
    .toFile(`uploads/brands/${filename}`);
    req.body.image = filename ;
    next();
};


exports.getBrands = factory.getAll(brand);

exports.createBrand = factory.createOne(brand);

exports.getBrand = factory.getOne(brand);

exports.updateBrand = factory.updateOne(brand);

exports.deleteBrand = factory.deleteOne(brand);
