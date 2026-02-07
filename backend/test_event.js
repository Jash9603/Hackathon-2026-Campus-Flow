const http = require('http');

const request = (path, method, data, token) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (data) {
            options.headers['Content-Length'] = Buffer.byteLength(data);
        }
        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => (body += chunk));
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve({ status: res.statusCode, body: parsed });
                } catch (e) {
                    console.log('Error parsing response:', body);
                    resolve({ status: res.statusCode, body: body });
                }

            });
        });

        req.on('error', (e) => reject(e));
        if (data) req.write(data);
        req.end();
    });
};

const runTests = async () => {
    try {
        console.log('--- Registering Organizer ---');
        const user = {
            name: 'Event Organizer',
            email: `organizer${Date.now()}@test.com`,
            password: 'password123',
            role: 'organizer'
        };

        const regRes = await request('/api/auth/register', 'POST', JSON.stringify(user));
        console.log('Reg Status:', regRes.status);
        if (regRes.status !== 201) {
            console.error('Registration failed');
            return;
        }
        const token = regRes.body.token;

        console.log('\n--- Creating Event ---');
        const eventData = {
            title: 'Hackathon 2026',
            description: 'A global hackathon event.',
            timeline: {
                start: new Date().toISOString(),
                end: new Date(Date.now() + 86400000).toISOString()
            },
            location: 'Campus Auditorium',
            themeConfig: {
                primaryColor: '#ff0000',
                darkMode: true
            },
            modules: [
                { type: 'registration', config: { limit: 100 } }
            ]
        };

        const createRes = await request('/api/events', 'POST', JSON.stringify(eventData), token);
        console.log('Create Status:', createRes.status);
        console.log('Event ID:', createRes.body._id);

        if (createRes.status !== 201) return;
        const eventId = createRes.body._id;

        console.log('\n--- Get All Events ---');
        const getAllRes = await request('/api/events', 'GET', null, null);
        console.log('Get All Status:', getAllRes.status);
        console.log('Count:', getAllRes.body.length);

        console.log('\n--- Get Single Event ---');
        const getOneRes = await request(`/api/events/${eventId}`, 'GET', null, null);
        console.log('Get One Status:', getOneRes.status);

        console.log('\n--- Update Event ---');
        const updateData = { title: 'Hackathon 2026 - Updated' };
        const updateRes = await request(`/api/events/${eventId}`, 'PUT', JSON.stringify(updateData), token);
        console.log('Update Status:', updateRes.status);
        console.log('New Title:', updateRes.body.title);

        console.log('\n--- Delete Event ---');
        const deleteRes = await request(`/api/events/${eventId}`, 'DELETE', null, token);
        console.log('Delete Status:', deleteRes.status);

        console.log('\n--- Verify Deletion ---');
        const verifyRes = await request(`/api/events/${eventId}`, 'GET', null, null);
        console.log('Verify Status (should be 404):', verifyRes.status);

    } catch (error) {
        console.error('Test Failed:', error);
    }
};

runTests();
