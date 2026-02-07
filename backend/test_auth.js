const http = require('http');

const postRequest = (path, data) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length,
            },
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => (body += chunk));
            res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body) }));
        });

        req.on('error', (e) => reject(e));
        req.write(data);
        req.end();
    });
};

const getRequest = (path, token) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => (body += chunk));
            res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body) }));
        });

        req.on('error', (e) => reject(e));
        req.end();
    });
};

const runTests = async () => {
    try {
        console.log('--- Testing Registration ---');
        const user = {
            name: 'Test User',
            email: `test${Date.now()}@example.com`,
            password: 'password123',
        };
        const regRes = await postRequest('/api/auth/register', JSON.stringify(user));
        console.log('Status:', regRes.status);
        console.log('Body:', regRes.body);

        if (regRes.status !== 201) return;

        const token = regRes.body.token;

        console.log('\n--- Testing Login ---');
        const loginRes = await postRequest('/api/auth/login', JSON.stringify({
            email: user.email,
            password: user.password,
        }));
        console.log('Status:', loginRes.status);
        console.log('Body:', loginRes.body);

        console.log('\n--- Testing Get Me ---');
        const meRes = await getRequest('/api/auth/me', token);
        console.log('Status:', meRes.status);
        console.log('Body:', meRes.body);

    } catch (error) {
        console.error('Test Failed:', error);
    }
};

runTests();
