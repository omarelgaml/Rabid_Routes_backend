const httpStatusCodes = require('./httpStatusCodes.js ');
const BaseError = require('./baseError');

class HTTP409Error extends BaseError {
  constructor(description) {
    super('ITEM ALREADY EXISTS', httpStatusCodes.CONFLICT, true, description);
  }
}
module.exports = HTTP409Error;
