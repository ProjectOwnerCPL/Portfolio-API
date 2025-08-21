const http = require('http');

const postData = JSON.stringify({
  "firstName": "Alex",
  "lastName": "Thompson",
  "position": "Senior Developer",
  "department": "IT",
  "email": "alex.thompson@fixersolutions.com",
  "phone": "+1 (555) 987-6543",
  "salary": 75000,
  "hireDate": "2025-08-20",
  "isActive": true
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/company-mongo/employees',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  
  let responseBody = '';
  res.on('data', (chunk) => {
    responseBody += chunk;
  });
  
  res.on('end', () => {
    console.log('Response Body:');
    console.log(JSON.stringify(JSON.parse(responseBody), null, 2));
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(postData);
req.end();
