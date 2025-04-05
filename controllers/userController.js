const user = require("../models/user.js");
const factory = require("./handelrsFactory.js");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const {
  uploadSingleImage,
} = require("../middlewares/uploadImageMiddleware.js");
const createToken = require("../utils/createToken.js");
const bcrypt = require("bcrypt");



exports.uploadUserImage = uploadSingleImage("profileImg");

exports.reSizeImage = async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 80 })
      .toFile(`uploads/users/${filename}`);
    req.body.profileImg = filename;
  }
  next();
};

exports.getUsers = factory.getAll(user);

exports.createUser = factory.createOne(user);

exports.getUser = factory.getOne(user);

exports.updateUser = factory.updateOne(user);

exports.changeUserPassowrd = factory.changeUserPassword(user);

exports.deleteUser = factory.deleteOne(user);

exports.getLoggedUserData = async (req, res, next) => {
  req.params.id = req.User.id;
  next();
};

exports.updateLoggedPassword = async (req, res, next) => {
  const { id } = req.User;
  const updateData = { password: req.body.password };

  if (updateData.password) {
    const hashedPassword = await bcrypt.hash(updateData.password, 10);
    updateData.password = hashedPassword;
  }

  updateData.passwordChangedAt = new Date();

  const Document = await user.update(updateData, {
    where: { id: id },
  });
  if (Document[0] === 0) {
    return next(new ApiError(`No Document For This Id ${id}`, 404));
  }

  const document = await user.findByPk(id);
  const token = createToken(id);
  res.status(200).send({ data: document , token });
  next();
};

exports.updateLoggedUserData = async( req , res , next) => {
  const userId = req.User.id;

  const updateData = { 
    name: req.body.name,    
    email: req.body.email, 
    phone: req.body.phone 
  };
  const Document  = await user.update(updateData, {
    where: { id: userId }
  });

  if (Document[0] === 0) {
    return next(new ApiError(`No Document For This Id ${userId}`, 404));
  }
  const document = await user.findByPk(userId);
  const token = createToken(userId);
  
  res.status(200).json({  document, token });
};