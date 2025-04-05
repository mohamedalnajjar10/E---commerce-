const {  body , check  } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const slugify = require("slugify");
const category = require("../../models/categories.js");
const subCategory = require("../../models/subCategory.js");
const {Op} = require ("sequelize");


exports.createProductValidator = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars")
    .notEmpty()
    .withMessage("Product required")
    .custom((value, { req }) => {
      req.body.slug = slugify(value, { lower: true });  
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ max: 2000 })
    .withMessage("Too long description"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 500 })
    .withMessage("To long price"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product priceAfterDiscount must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),

  check("colors")
    .optional()
    .isArray()
    .withMessage("availableColors should be array of string"),
  check("imageCover").notEmpty().withMessage("Product imageCover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of string"),
  check("categoryId")
    .notEmpty()
    .withMessage("Product must be belong to a category")
    .isInt()
    .withMessage("Invalid ID formate")
      .custom((categoryId) =>
        category.findByPk(categoryId).then((category) => {
          if (!category) {
            return Promise.reject(
              new Error(`No category for this id: ${categoryId}`)
            );
          }
        })
      ),

    check("subCategoryId")
      .optional()
      .isInt()
      .withMessage("Invalid ID formate")
      .custom((subCategoryId) =>
        subCategory.findAll({ id: { $exists: true,  where: {
          subCategoryId: {
            [Op.in]: subCategoryId,  // بدل $in استخدم Op.in
          }
        } } }).then(
          (result) => {
            if (result.length < 1 || result.isLength !== subCategoryId.isLength) {
              return Promise.reject(new Error(`Invalid subcategories Ids`));
            }
          }
        )
      )
      .custom((value, { req }) => {
        // تأكد من أن value هي مصفوفة، إذا لم تكن، حولها إلى مصفوفة تحتوي على القيمة المفردة
        const target = Array.isArray(value) ? value : [value]; // تحويل القيمة المفردة إلى مصفوفة
      
        return subCategory.findAll({ where: { categoryId: req.body.categoryId } }).then((subCategories) => {
          const subCategoriesIdsInDB = subCategories.map(subCategory => subCategory.id.toString());
      
          // الآن يمكنك استخدام .every() على target لأننا ضمنا أن تكون مصفوفة
          if (!target.every((v) => subCategoriesIdsInDB.includes(v))) {
            return Promise.reject(new Error("subcategory not belong to category"));
          }
          return true;
        });
      }),
  
  check("brand").optional().isInt().withMessage("Invalid ID formate"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),

  validatorMiddleware,
];

exports.getProductValidator = [
  check("id").isInt().withMessage("Invalid ID formate"),
  validatorMiddleware,
];

exports.updateProductValidator = [
check("id").isInt().withMessage("Invalid ID formate"),
  body("title")
    .optional()
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isInt().withMessage("Invalid ID formate"),
  validatorMiddleware,
];
