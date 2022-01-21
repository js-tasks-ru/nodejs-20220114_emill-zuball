const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this._options = options;
    this._size = 0;
  }

  _transform(chunk, encoding, callback) {
    this._size += chunk.length;

    let error = null;

    if (this._size > this._options.limit) {
      error = new LimitExceededError();
    }

    callback(error, chunk);
  }
}

module.exports = LimitSizeStream;
