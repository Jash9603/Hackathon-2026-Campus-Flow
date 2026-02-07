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
            name: 'Vote Organizer',
            email: `vote_org${Date.now()}@test.com`,
            password: 'password123',
            role: 'organizer'
        };
        const orgRes = await request('/api/auth/register', 'POST', JSON.stringify(organizer));
        const orgToken = orgRes.body.token;

        console.log('\n--- Creating Event with Voting Module ---');
        const eventData = {
            title: 'Vote Event',
            description: 'Event with voting',
            timeline: {
                start: new Date().toISOString(),
                end: new Date(Date.now() + 86400000).toISOString()
            },
            location: 'Hall B',
            modules: [
                { type: 'voting', config: { polls: [{ id: 'p1', question: 'Q1' }] } }
            ]
        };
        const eventRes = await request('/api/events', 'POST', JSON.stringify(eventData), orgToken);
        const eventId = eventRes.body._id;
        console.log('Event Created:', eventId);

        console.log('\n--- Registering Student ---');
        const student = {
            name: 'Vote Student',
            email: `vote_stu${Date.now()}@test.com`,
            password: 'password123',
            role: 'student'
        };
        const stuRes = await request('/api/auth/register', 'POST', JSON.stringify(student));
        const stuToken = stuRes.body.token;

        console.log('\n--- Student Casting Vote ---');
        const voteData = { targetId: 'p1', value: 'yes' };
        const voteRes = await request(`/api/votes/${eventId}`, 'POST', JSON.stringify(voteData), stuToken);
        console.log('Vote Status:', voteRes.status);

        console.log('\n--- Changing Vote ---');
        const voteData2 = { targetId: 'p1', value: 'no' };
        const voteRes2 = await request(`/api/votes/${eventId}`, 'POST', JSON.stringify(voteData2), stuToken);
        console.log('Vote2 Status:', voteRes2.status);
        console.log('New Value:', voteRes2.body.value);

        console.log('\n--- Get Event Votes (Aggregated) ---');
        const aggRes = await request(`/api/votes/event/${eventId}`, 'GET', null, null);
        console.log('Agg Status:', aggRes.status);
        console.log('Agg Body:', JSON.stringify(aggRes.body));

    } catch (error) {
        console.error('Test Failed:', error);
    }
};

runTests();
