const http = require('http');

async function test() {
  const loginData = JSON.stringify({ username: 'admin', password: 'password123' });
  const req = http.request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginData)
    }
  }, (res) => {
    let cookie = res.headers['set-cookie'];
    if (!cookie) {
      console.log('No cookie received', res.statusCode);
      return;
    }
    
    // Request appointments
    const getReq = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/appointments?search=john',
      method: 'GET',
      headers: {
        'Cookie': cookie[0]
      }
    }, (res2) => {
      let data = '';
      res2.on('data', chunk => data += chunk);
      res2.on('end', () => console.log('GET /api/appointments?search=john:', res2.statusCode, data));
    });
    getReq.end();
  });

  req.write(loginData);
  req.end();
}

test();
