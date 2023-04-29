const httpStatusCodes = require('./httpStatusCodes.js ');
const BaseError = require('./baseError');

class HTTP400Error extends BaseError {
  constructor(description) {
    super('BAD REQUEST', httpStatusCodes.BAD_REQUEST, true, description);
  }
}
module.exports = HTTP400Error;
