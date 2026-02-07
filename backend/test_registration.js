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
        const organizer = {
            name: 'Reg Organizer',
            email: `reg_org${Date.now()}@test.com`,
            password: 'password123',
            role: 'organizer'
        };
        const orgRes = await request('/api/auth/register', 'POST', JSON.stringify(organizer));
        const orgToken = orgRes.body.token;

        console.log('\n--- Creating Event with Reg Module ---');
        const eventData = {
            title: 'Reg Event',
            description: 'Event with registration',
            timeline: {
                start: new Date().toISOString(),
                end: new Date(Date.now() + 86400000).toISOString()
            },
            location: 'Hall A',
            modules: [
                { type: 'registration', config: { limit: 50 } }
            ]
        };
        const eventRes = await request('/api/events', 'POST', JSON.stringify(eventData), orgToken);
        const eventId = eventRes.body._id;
        console.log('Event Created:', eventId);

        console.log('\n--- Registering Student ---');
        const student = {
            name: 'Reg Student',
            email: `reg_stu${Date.now()}@test.com`,
            password: 'password123',
            role: 'student'
        };
        const stuRes = await request('/api/auth/register', 'POST', JSON.stringify(student));
        const stuToken = stuRes.body.token;

        console.log('\n--- Student Registering for Event ---');
        const regData = { responses: { 't-shirt-size': 'M' } };
        const regRes = await request(`/api/registrations/${eventId}`, 'POST', JSON.stringify(regData), stuToken);
        console.log('Reg Status:', regRes.status);
        const regId = regRes.body._id;

        console.log('\n--- Student Getting My Registrations ---');
        const myRegs = await request('/api/registrations/my', 'GET', null, stuToken);
        console.log('My Regs Count:', myRegs.body.length);

        console.log('\n--- Organizer Getting Event Registrations ---');
        const eventRegs = await request(`/api/registrations/event/${eventId}`, 'GET', null, orgToken);
        console.log('Event Regs Count:', eventRegs.body.length);

        console.log('\n--- Organizer Updating Status ---');
        const updateData = { status: 'confirmed' };
        const updateRes = await request(`/api/registrations/update/${regId}`, 'PUT', JSON.stringify(updateData), orgToken); // Wait, route is PUT /:id not /update/:id
        // Route definition: router.put('/:id', protect, organizer, updateRegistrationStatus);
        // Correction: /api/registrations/${regId}
        const correctUpdateRes = await request(`/api/registrations/${regId}`, 'PUT', JSON.stringify(updateData), orgToken);
        console.log('Update Status:', correctUpdateRes.status);
        console.log('New Status:', correctUpdateRes.body.status);

    } catch (error) {
        console.error('Test Failed:', error);
    }
};

runTests();
