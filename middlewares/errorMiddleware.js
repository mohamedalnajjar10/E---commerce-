const ApiError = require("../utils/ApiError");

const handleJwtInvalidSignature = () =>
  new ApiError("Invalid token, please login again..", 401);

const handleJwtExpired = () =>
  new ApiError("Expired token, please login again..", 401);

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorForDev(err, res);
  } else {
    if (err.name == "JsonWebTokenError") {
      err = handleJwtInvalidSignature();
      if (err.name === "TokenExpiredError") 
        err = handleJwtExpired();
    }
  }
};

const sendErrorForDev = (err, res) => {
  return res.status(err.statusCode).send({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

module.exports = globalError;
