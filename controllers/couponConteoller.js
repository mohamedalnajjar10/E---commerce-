const factory = require ("./handelrsFactory.js");
const coupon = require ("../models/coupon.js");



exports.getCoupons = factory.getAll(coupon);

exports.creatCoupon = factory.createOne(coupon);

exports.getCoupon = factory.getOne(coupon);

exports.updatCoupon = factory.updateOne(coupon);

exports.deletCoupon = factory.deleteOne(coupon);
