const BaseError = require('../config/baseError');

function logError(err) {
  console.error(err);
}

function logErrorMiddleware(err, _req, _res, next) {
  logError(err);
  next(err);
}

function returnError(err, _req, res, next) {
  res.status(err.statusCode || 500).send({ message: err.message });
}

function isOperationalError(error) {
  if (error instanceof BaseError) {
    return error.isOperational;
  }
  return false;
}

module.exports = {
  logError,
  logErrorMiddleware,
  returnError,
  isOperationalError,
};
