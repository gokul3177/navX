const http = require('http');

const data = JSON.stringify({
  algorithm: 'BFS',
  gridSize: 10,
  start: [0, 0],
  goal: [9, 9],
  obstacles: []
});

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/simulate',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
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
req.write(data);
req.end();
