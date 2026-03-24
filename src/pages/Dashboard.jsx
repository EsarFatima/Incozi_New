import React from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { Link } from 'react-router-dom';

function Dashboard() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-12 rounded-2xl shadow-xl text-center max-w-md w-full mx-4">
          <div className="w-16 h-16 bg-[#d4eaf7] text-[#00668c] rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fa-solid fa-lock text-2xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Access Denied</h1>
          <p className="text-gray-600 mb-8">Please log in to view and manage your services.</p>
          <div className="flex flex-col gap-3">
            <Link to="/account" className="w-full py-3 px-6 bg-[#00668c] text-white font-bold rounded-lg hover:bg-[#004d6a] transition-all">
              Log In
            </Link>
            <Link to="/" className="w-full py-3 px-6 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="bg-dark-50 py-12">
        <div className="container-custom">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <p className="text-lg text-dark-600">Welcome, {user?.name}!</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="card">
              <h3 className="text-lg font-semibold mb-2">Active Consultations</h3>
              <p className="text-4xl font-bold text-primary-500">0</p>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold mb-2">Total Spent</h3>
              <p className="text-4xl font-bold text-primary-500">$0</p>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold mb-2">Documents</h3>
              <p className="text-4xl font-bold text-primary-500">0</p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
            <p className="text-dark-600">No activities yet.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
