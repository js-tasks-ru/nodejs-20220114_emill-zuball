const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.encoding = options.encoding;
    this.savedString = '';
  }

  _lastSymbolIsEOL(str) {
    return str[str.length - 1] === os.EOL;
  }

  _transform(chunk, encoding, callback) {
    let arr = [];
    let result = null;
    const str = chunk.toString(this.encoding);

    if (str.includes(os.EOL)) {
      const fullString = `${this.savedString}${str}`;
      arr = fullString.split(os.EOL);

      // if the last symbol is not EOL save and delete from array
      if (!this._lastSymbolIsEOL(str)) {
        this.savedString = arr[arr.length - 1];
        arr.pop();
      }

      // We have to call callback so we need to put data into result
      // In this case data is the first element of array
      if (arr.length) {
        result = arr[0];
        arr.shift();
      }
    } else {
      // If chunk will not have any os.EOL
      // then in _flush method, it will be pushed to stream as one line
      this.savedString += str;
    }

    callback(null, result);

    arr.forEach((i) => this.push(i));
  }

  _flush(callback) {
    this.push(this.savedString);
    callback();
  }
}

module.exports = LineSplitStream;
