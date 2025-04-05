const category = require("../models/categories.js");
const factory = require("./handelrsFactory.js");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const {uploadSingleImage} = require ("../middlewares/uploadImageMiddleware.js");

//DiskStorage engine
// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/categories");
//   },
//   filename: function (req, file, cb) {
//     const ext = file.mimetype.split("/")[1];
//     const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
//     cb(null, filename);
//   },
// });

//memoryStorage engine
// const multerStorage = multer.memoryStorage();

// const multerFilter = function (req, file, cb) {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb(new ApiError(" Only Images Allowed", 400), false);
//   }
// };

// const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadCategoryImage = uploadSingleImage('image');

exports.reSizeImage = async(req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
 if (req.file) {
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 80 })
    .toFile(`uploads/categories/${filename}`);
 }
    req.body.image = filename ;
    next();
};

exports.getCategories = factory.getAll(category);

exports.createCategory = factory.createOne(category); 

exports.getCategory = factory.getOne(category);

exports.updateCategory = factory.updateOne(category);

exports.deleteCategory = factory.deleteOne(category);
