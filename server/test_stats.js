const http = require('http');

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/history/stats',
  method: 'GET'
};

const req = http.request(options, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Body:', body);
  });
});

req.on('error', error => console.error(error));
req.end();
