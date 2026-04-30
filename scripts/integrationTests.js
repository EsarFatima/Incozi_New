const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
let testToken = '';
let testUserId = '';
let passed = 0, failed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(? );
    passed++;
  } catch (error) {
    const errMsg = error.response?.data?.error || error.message;
    console.log(?  - );
    failed++;
  }
}

async function runTests() {
  console.log('\n?? Starting MongoDB Backend Integration Tests\n');

  const testEmail = 	est@example.com;
  const testPassword = 'Test@123456';

  console.log('?? AUTH ENDPOINTS');
  await test('POST /auth/signup', async () => {
    const res = await axios.post(${BASE_URL}/auth/signup, {
      email: testEmail,
      password: testPassword,
      firstName: 'Test',
      lastName: 'User'
    });
    if (!res.data.message) throw new Error('No message');
  });

  await test('POST /auth/login', async () => {
    const res = await axios.post(${BASE_URL}/auth/login, {
      email: testEmail,
      password: testPassword
    });
    testToken = res.data.token;
    testUserId = res.data.user.id;
    if (!testToken || !testUserId) throw new Error('Missing token');
  });

  await test('GET /auth/profile/:userId', async () => {
    const res = await axios.get(${BASE_URL}/auth/profile/, {
      headers: { 'Authorization': Bearer  }
    });
    if (!res.data.email) throw new Error('No profile');
  });

  console.log('\n?? SERVICES ENDPOINTS');
  await test('GET /services', async () => {
    const res = await axios.get(${BASE_URL}/services);
    if (!Array.isArray(res.data)) throw new Error('Not array');
  });

  await test('GET /services/my-subscriptions', async () => {
    const res = await axios.get(${BASE_URL}/services/my-subscriptions?userId=);
    if (!Array.isArray(res.data)) throw new Error('Not array');
  });

  console.log('\n?? CONSULTATIONS ENDPOINTS');
  await test('GET /consultations', async () => {
    const res = await axios.get(${BASE_URL}/consultations, {
      headers: { 'Authorization': Bearer  }
    });
    if (!Array.isArray(res.data)) throw new Error('Not array');
  });

  await test('GET /consultations/booked-slots', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    const res = await axios.get(${BASE_URL}/consultations/booked-slots?date=);
    if (!Array.isArray(res.data)) throw new Error('Not array');
  });

  await test('POST /consultations/book', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    const res = await axios.post(${BASE_URL}/consultations/book, {
      date: dateStr,
      time: '14:00',
      topic: 'Business Consultation',
      notes: 'Test'
    }, {
      headers: { 'Authorization': Bearer  }
    });
    if (!res.data.consultation) throw new Error('No consultation');
  });

  console.log('\n?? DOCUMENTS ENDPOINTS');
  await test('GET /documents/my-documents', async () => {
    const res = await axios.get(${BASE_URL}/documents/my-documents, {
      headers: { 'Authorization': Bearer  }
    });
    if (!Array.isArray(res.data)) throw new Error('Not array');
  });

  console.log('\n?? DASHBOARD ENDPOINTS');
  await test('GET /dashboard/accounting', async () => {
    const res = await axios.get(${BASE_URL}/dashboard/accounting, {
      headers: { 'Authorization': Bearer  }
    });
    if (!Array.isArray(res.data)) throw new Error('Not array');
  });

  await test('GET /dashboard/payment-methods', async () => {
    const res = await axios.get(${BASE_URL}/dashboard/payment-methods, {
      headers: { 'Authorization': Bearer  }
    });
    if (!Array.isArray(res.data)) throw new Error('Not array');
  });

  console.log(\n?? Results: ?  passed, ?  failed\n);
  process.exit(failed === 0 ? 0 : 1);
}

runTests().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
