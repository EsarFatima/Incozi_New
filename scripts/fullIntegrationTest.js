const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
let testToken = '';
let testUserId = '';
let serviceId = '';
let passed = 0, failed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error) {
    const errMsg = error.response?.data?.error || error.message;
    console.log(`❌ ${name} - ${errMsg}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n🧪 COMPREHENSIVE MongoDB Integration Tests\n');

  const testEmail = `test${Date.now()}@example.com`;
  const testPassword = 'Test@123456';

  console.log('📍 PHASE 1: Authentication');
  
  await test('POST /auth/signup', async () => {
    const res = await axios.post(`${BASE_URL}/auth/signup`, {
      email: testEmail,
      password: testPassword,
      firstName: 'Integration',
      lastName: 'Tester'
    });
    if (!res.data.message || !res.data.message.includes('Registration')) throw new Error('Invalid signup response');
  });

  await test('POST /auth/login', async () => {
    const res = await axios.post(`${BASE_URL}/auth/login`, {
      email: testEmail,
      password: testPassword
    });
    testToken = res.data.token;
    testUserId = res.data.user.id;
    if (!testToken || !testUserId) throw new Error('Missing token or user id');
  });

  await test('GET /auth/profile/:userId', async () => {
    const res = await axios.get(`${BASE_URL}/auth/profile/${testUserId}`, {
      headers: { 'Authorization': `Bearer ${testToken}` }
    });
    if (!res.data.email) throw new Error('Profile not found');
  });

  console.log('\n📍 PHASE 2: Services');

  await test('GET /services (list all services)', async () => {
    const res = await axios.get(`${BASE_URL}/services`);
    if (!Array.isArray(res.data) || res.data.length === 0) throw new Error('No services found');
    serviceId = res.data[0]._id;
  });

  await test('GET /services/my-subscriptions (empty initially)', async () => {
    const res = await axios.get(`${BASE_URL}/services/my-subscriptions?userId=${testUserId}`);
    if (!Array.isArray(res.data)) throw new Error('Not array');
  });

  console.log('\n📍 PHASE 3: Consultations');

  await test('GET /consultations/booked-slots', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    const res = await axios.get(`${BASE_URL}/consultations/booked-slots?date=${dateStr}`);
    if (!Array.isArray(res.data)) throw new Error('Not array');
  });

  await test('POST /consultations/book (create booking)', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    const res = await axios.post(`${BASE_URL}/consultations/book`, {
      date: dateStr,
      time: '14:00',
      topic: 'Business Setup',
      notes: 'Integration test booking'
    }, {
      headers: { 'Authorization': `Bearer ${testToken}` }
    });
    if (!res.data.consultation) throw new Error('No consultation returned');
  });

  await test('GET /consultations (list user consultations)', async () => {
    const res = await axios.get(`${BASE_URL}/consultations`, {
      headers: { 'Authorization': `Bearer ${testToken}` }
    });
    if (!Array.isArray(res.data)) throw new Error('Not array');
  });

  console.log('\n📍 PHASE 4: Documents');

  await test('GET /documents/my-documents', async () => {
    const res = await axios.get(`${BASE_URL}/documents/my-documents`, {
      headers: { 'Authorization': `Bearer ${testToken}` }
    });
    if (!Array.isArray(res.data)) throw new Error('Not array');
  });

  console.log('\n📍 PHASE 5: Dashboard & Accounting');

  await test('GET /dashboard/accounting', async () => {
    const res = await axios.get(`${BASE_URL}/dashboard/accounting`, {
      headers: { 'Authorization': `Bearer ${testToken}` }
    });
    if (!Array.isArray(res.data)) throw new Error('Not array');
  });

  await test('GET /dashboard/payment-methods', async () => {
    const res = await axios.get(`${BASE_URL}/dashboard/payment-methods`, {
      headers: { 'Authorization': `Bearer ${testToken}` }
    });
    if (!Array.isArray(res.data)) throw new Error('Not array');
  });

  await test('GET /dashboard/entities', async () => {
    const res = await axios.get(`${BASE_URL}/dashboard/entities`, {
      headers: { 'Authorization': `Bearer ${testToken}` }
    });
    if (!Array.isArray(res.data)) throw new Error('Not array');
  });

  console.log('\n📍 PHASE 6: Admin Features');

  await test('GET /admin/stats (with admin check)', async () => {
    const res = await axios.get(`${BASE_URL}/admin/stats`, {
      headers: { 'Authorization': `Bearer ${testToken}` }
    }).catch(e => {
      if (e.response?.status === 403) return { data: { message: 'Non-admin denied (expected)' } };
      throw e;
    });
    if (!res.data) throw new Error('No response');
  });

  await test('GET /admin/orders (with admin check)', async () => {
    const res = await axios.get(`${BASE_URL}/admin/orders`, {
      headers: { 'Authorization': `Bearer ${testToken}` }
    }).catch(e => {
      if (e.response?.status === 403) return { data: { message: 'Non-admin denied (expected)' } };
      throw e;
    });
    if (!res.data) throw new Error('No response');
  });

  console.log('\n📊 TEST RESULTS');
  console.log(`${'-'.repeat(50)}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total: ${passed + failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  console.log(`${'-'.repeat(50)}\n`);

  process.exit(failed === 0 ? 0 : 1);
}

runTests().catch(err => {
  console.error('Fatal Error:', err.message);
  process.exit(1);
});
