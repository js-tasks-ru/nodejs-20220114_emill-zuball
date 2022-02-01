const http = require('http');
const path = require('path');
const fs = require('fs');

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
    case 'DELETE':
      fs.unlink(filepath, (error) => {
        if (error && error.code === 'ENOENT') {
          res.statusCode = 404;
          res.end('File is not found');
        } else if (error) {
          res.statusCode = 500;
          res.end('Server error');
        } else {
          res.statusCode = 200;
          res.end('File deleted successfully');
        }
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
