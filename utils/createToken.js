const jwt = require("jsonwebtoken");
// تعريف الدالة createToken
const createToken = (payload) => {
  return jwt.sign({ userId: payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

module.exports = createToken;