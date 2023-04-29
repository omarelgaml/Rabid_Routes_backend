const httpStatusCodes = require('./httpStatusCodes.js ');
const BaseError = require('./baseError');

class HTTP401Error extends BaseError {
  constructor(description) {
    super('UNAUTHRIZED', httpStatusCodes.UNAUTHRIZED, true, description);
  }
}
module.exports = HTTP401Error;
