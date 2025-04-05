const fs = require('fs');
require('colors');
const dotenv = require('dotenv');
const product = require('../../models/product');

dotenv.config({ path: '../../config.env' });


// قراءة البيانات
const products = JSON.parse(fs.readFileSync('./products.json', 'utf-8'));

// إدخال البيانات في قاعدة البيانات
const insertData = async () => {
  try {
    // استخدام bulkCreate لإدخال البيانات دفعة واحدة
    await product.bulkCreate(products);

    console.log('Data Inserted'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// حذف البيانات من قاعدة البيانات
const destroyData = async () => {
  try {
    // حذف جميع السجلات باستخدام destroy
    await product.destroy({
      where: {},
      truncate: true // هذا سيحذف جميع البيانات من الجدول
    });

    console.log('Data Destroyed'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// تنفيذ المهام بناءً على الخيار الذي يمرره المستخدم
if (process.argv[2] === '-i') {
  insertData();
} else if (process.argv[2] === '-d') {
  destroyData();
}