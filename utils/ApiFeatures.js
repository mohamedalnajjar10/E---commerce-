const { Op } = require("sequelize");

class ApiFeatures {
  constructor(model, queryString) {
    this.model = model; // Sequelize model
    this.queryString = queryString; // Request query parameters
    this.queryOptions = {}; // Options object for Sequelize
  }

  // 1. Filtering

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields", "search"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced filtering (e.g., gte, lte, gt, lt)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.queryOptions.where = JSON.parse(queryStr);
    return this;
  }

  // 2. Sorting

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").map((field) => {
        if (field.startsWith("-")) {
          // إذا كان الحقل يحتوي على علامة "-", يتم الترتيب تنازليًا
          return [field.substring(1), "DESC"];
        } else {
          // إذا لم يحتوي على علامة "-", يتم الترتيب تصاعديًا
          return [field, "ASC"];
        }
      });
      this.queryOptions.order = sortBy;
    } else {
      // الترتيب الافتراضي
      this.queryOptions.order = [["createdAt", "DESC"]];
    }
    return this;
  }

  // 3. Field Limiting

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields
        .split(",")
        .map((field) => field.trim());
      this.queryOptions.attributes = fields;
    }
    return this;
  }

  // 4. Search

  search(modelName) {
    if (this.queryString.search) {
      const searchTerm = this.queryString.search;
      let searchCondition = {};

      if (modelName === "product") {
        searchCondition = {
          [Op.or]: [
            { title: { [Op.like]: `%${searchTerm}%` } },
            { description: { [Op.like]: `%${searchTerm}%` } },
          ],
        };
      } else {
        searchCondition = {
          [Op.or]: [{ name: { [Op.like]: `%${searchTerm}%` } }],
        };
      }

      // دمج شروط البحث مع الشروط الموجودة مسبقًا
      this.queryOptions.where = {
        ...this.queryOptions.where,
        ...searchCondition,
      };
    }
    return this;
  }
  
  // 5. Pagination

  paginate(countDocuments) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const offset = (page - 1) * limit;
    const endIndex = page * limit; //2*10 = 20 (endIndex)

    const Pagination = {};
    Pagination.currentPage = page;
    Pagination.limit = limit;
    Pagination.numberOfPages = countDocuments; // 50 (Doc) / 10 (limit) = 5 pages

    //next page
    if (endIndex < countDocuments) {
      Pagination.next = page + 1;
    }
    // prev page
    if (offset > 0) {
      Pagination.prev = page - 1;
    }
    this.queryOptions.limit = limit;
    this.queryOptions.offset = offset;
    this.queryOptions.Pagination = Pagination;
    return this;
  }

  // Execute the query
  async execute() {
    return await this.model.findAll(this.queryOptions);
  }
}

module.exports = ApiFeatures;
