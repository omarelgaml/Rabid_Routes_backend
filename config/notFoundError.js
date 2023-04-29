const httpStatusCodes = require('./httpStatusCodes.js ');
const BaseError = require('./baseError');

class HTTP404Error extends BaseError {
  constructor(description) {
    super('NOT FOUND', httpStatusCodes.NOT_FOUND, true, description);
  }
}
module.exports = HTTP404Error;
