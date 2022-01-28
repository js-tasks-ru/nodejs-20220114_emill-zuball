const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('../01-limit-size-stream/LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  if (pathname.includes('/')) {
    res.statusCode = 400;
    res.end('Nested directories are not supported');
    return;
  }

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      const limitSizeStream = new LimitSizeStream({limit: 1e6});
      const writeStream = fs.createWriteStream(filepath, {flags: 'wx'});

      req.on('aborted', () => {
        writeStream.destroy();
        limitSizeStream.destroy();

        fs.unlink(filepath, () => {});
      });


      limitSizeStream.on('error', (err) => {
        if (err.code === 'LIMIT_EXCEEDED') {
          fs.unlink(filepath, (_err) => {
            if (_err) {
              res.statusCode = 500;
              res.end('Server error');
            } else {
              res.statusCode = 413;
              res.end('File is too big');
            }
          });
        } else {
          res.statusCode = 500;
          res.end('Server error');
        }
      });

      writeStream.on('error', (error) => {
        if (error.code === 'EEXIST') {
          res.statusCode = 409;
          res.end('File is already exist');
        } else {
          res.statusCode = 500;
          res.end('Server error');
        }
      });

      req
          .pipe(limitSizeStream)
          .pipe(writeStream);

      writeStream.on('finish', () => {
        res.statusCode = 201;
        res.end('Success');
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
