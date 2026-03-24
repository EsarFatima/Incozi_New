import React from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { Link } from 'react-router-dom';

function AdminPanel() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-dark-600 mb-6">You don't have permission to access this page.</p>
          <Link to="/" className="btn-primary">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="bg-dark-50 py-12">
        <div className="container-custom">
          <h1 className="text-4xl font-bold">Admin Panel</h1>
        </div>
      </section>

      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <div className="card">
              <h3 className="text-sm font-semibold text-dark-600 mb-2">Total Users</h3>
              <p className="text-3xl font-bold">0</p>
            </div>
            <div className="card">
              <h3 className="text-sm font-semibold text-dark-600 mb-2">Consultations</h3>
              <p className="text-3xl font-bold">0</p>
            </div>
            <div className="card">
              <h3 className="text-sm font-semibold text-dark-600 mb-2">Revenue</h3>
              <p className="text-3xl font-bold">$0</p>
            </div>
            <div className="card">
              <h3 className="text-sm font-semibold text-dark-600 mb-2">Services</h3>
              <p className="text-3xl font-bold">0</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Management</h2>
              <div className="space-y-3">
                <a href="#users" className="block p-3 bg-dark-50 rounded hover:bg-dark-100 transition">Manage Users</a>
                <a href="#consultations" className="block p-3 bg-dark-50 rounded hover:bg-dark-100 transition">Manage Consultations</a>
                <a href="#services" className="block p-3 bg-dark-50 rounded hover:bg-dark-100 transition">Manage Services</a>
                <a href="#payments" className="block p-3 bg-dark-50 rounded hover:bg-dark-100 transition">View Payments</a>
              </div>
            </div>

            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Reports</h2>
              <div className="space-y-3">
                <a href="#revenue" className="block p-3 bg-dark-50 rounded hover:bg-dark-100 transition">Revenue Report</a>
                <a href="#users-stats" className="block p-3 bg-dark-50 rounded hover:bg-dark-100 transition">User Statistics</a>
                <a href="#activity" className="block p-3 bg-dark-50 rounded hover:bg-dark-100 transition">Activity Log</a>
                <a href="#export" className="block p-3 bg-dark-50 rounded hover:bg-dark-100 transition">Export Data</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminPanel;
