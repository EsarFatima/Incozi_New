const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function debugTest() {
  try {
    // First signup and login
    const testEmail = `debug${Date.now()}@example.com`;
    const signupRes = await axios.post(`${BASE_URL}/auth/signup`, {
      email: testEmail,
      password: 'Test@123456',
      firstName: 'Debug',
      lastName: 'User'
    });
    console.log('✅ Signup successful');

    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: testEmail,
      password: 'Test@123456'
    });
    const token = loginRes.data.token;
    const userId = loginRes.data.user.id;
    console.log('✅ Login successful, token:', token.substring(0, 20) + '...');

    // Test 1: Book consultation
    console.log('\n📍 Testing /consultations/book:');
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().split('T')[0];
      
      console.log('  Booking data:', { date: dateStr, time: '14:00', topic: 'Debug Test', notes: 'Test' });
      
      const bookRes = await axios.post(`${BASE_URL}/consultations/book`, {
        date: dateStr,
        time: '14:00',
        topic: 'Debug Test',
        notes: 'Test booking'
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('✅ Booking successful:', bookRes.data);
    } catch (err) {
      console.error('❌ Booking failed:', err.response?.data || err.message);
    }

    // Test 2: Get admin orders (correct endpoint)
    console.log('\n📍 Testing /services/admin/orders:');
    try {
      const ordersRes = await axios.get(`${BASE_URL}/services/admin/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('✅ Admin orders fetched:', ordersRes.data.length, 'orders');
    } catch (err) {
      console.error('❌ Admin orders failed:', err.response?.status, err.response?.data || err.message);
    }

  } catch (error) {
    console.error('Fatal Error:', error.message);
  }
}

debugTest();
