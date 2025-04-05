const ApiFeatures = require("../utils/ApiFeatures.js");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError.js");
const { Op, where } = require("sequelize");
const bcrypt = require("bcrypt");
const review = require("../models/review.js");
const product = require("../models/product.js");
const connection = require("../config/database.js");

review.calcAverageRatingsAndQuantity = async function (productId) {
  const result = await review.findAll({
    attributes: [
      [connection.fn("AVG", connection.col("ratings")), "avgRatings"],
      [connection.fn("COUNT", connection.col("ratings")), "ratingsQuantity"],
    ],
    where: { productId },
    raw: true,
  });

  if (result.length > 0 && result[0].ratingsQuantity > 0) {
    await product.update(
      {
        ratingsAverage: result[0].avgRatings,
        ratingsQuantity: result[0].ratingsQuantity,
      },
      { where: { id: productId } }
    );
  } else {
    await product.update(
      {
        ratingsAverage: 0,
        ratingsQuantity: 0,
      },
      { where: { id: productId } }
    );
  }
};

review.addHook("afterCreate", async (review, options) => {
  await review.constructor.calcAverageRatingsAndQuantity(review.productId);
});

review.addHook("afterDestroy", async (review, options) => {
  await review.constructor.calcAverageRatingsAndQuantity(review.productId);
});

exports.deleteOne = (Model) => {
  return asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const Document = await Model.findOne({ where: { id: id } });
    if (!Document) {
      return next(new ApiError(`No Document For This Id ${id}`, 404));
    }
    await Document.destroy();

    res.status(204).send();
  });
};

exports.changeUserPassword = (Model) => {
  return asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const updateData = { password: req.body.password };

    if (updateData.password) {
      const hashedPassword = await bcrypt.hash(updateData.password, 10);
      updateData.password = hashedPassword;
    }

    // تحديث حقل passwordChangedAt  
    updateData.passwordChangedAt = new Date();

    const Document = await Model.update(updateData, {
      where: { id: id },
    });
    if (Document[0] === 0) {
      return next(new ApiError(`No Document For This Id ${id}`, 404));
    }

    const document = await Model.findByPk(id);

    res.status(200).send({ data: document });
  });
};

exports.updateOne = (Model) => {
  return asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // 1. تحديث البيانات أولًا
    const Document = await Model.update(req.body, {
      where: { id: id },
    });
    // 2. إذا ال categoryId غير موجود
    if (!Document) {
      return next(new ApiError(`No Document For This Id ${id}`, 404));
    }
    // 3. جلب البيانات المحدثة من قاعدة البيانات
    const document = await Model.findByPk(id, {});
    res.status(200).send({ data: document });
  });
};

exports.createOne = (Model) => {
  return asyncHandler(async (req, res) => {
    // 1. إنشاء نسخة من البيانات المرسلة لتجنب التعديل المباشر على req.body
    const documentData = { ...req.body };

    // 2. تشفير كلمة المرور إذا كانت موجودة في البيانات
    if (documentData.password) {
      const hashedPassword = await bcrypt.hashSync(documentData.password, 10);
      documentData.password = hashedPassword;
    }
    const NewDocument = await Model.create(documentData);
    res.status(201).send({ data: NewDocument });
  });
};

exports.getOne = (Model) => {
  return asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const Document = await Model.findByPk(id);
    if (!Document) {
      return next(new ApiError(`No Document For This Id ${id}`, 404));
    }
    res.status(200).send({ data: Document });
  });
};

exports.getAll = (Model) => {
  return asyncHandler(async (req, res, next) => {
    try {
      let filterObject = {};
      if (req.params.Model) filterObject = { documents: req.params.Model };
      req.filterObj = filterObject || {};
      
      // حساب عدد المستندات
      const totalDocuments = await Model.count();

      // إنشاء كائن ApiFeatures
      const features = new ApiFeatures(Model, req.query);
      features
        .filter()
        .sort()
        .limitFields()
        .search(Model.name)
        .paginate(totalDocuments);

      // تنفيذ الاستعلام
      const documents = await features.execute();

      // إرسال الاستجابة
      res.status(200).json({
        status: "success",
        results: documents.length,
        pagination: features.queryOptions.Pagination,
        data: documents,
      });
    } catch (error) {
      next(new ApiError(error.message, 500));
    }
  });
};
