import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { Link } from 'react-router-dom';
import { adminService } from '../services/api.js';

function AdminPanel() {
  const { isAuthenticated, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDocs, setUserDocs] = useState([]);
  const [stats, setStats] = useState({ users: 0, consultations: 0, orders: 0, documents: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchAdminData();
    }
  }, [isAuthenticated, user]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [usersRes, statsRes] = await Promise.all([
        adminService.getUsers(),
        adminService.getStats()
      ]);
      setUsers(usersRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const viewUserDocs = async (user) => {
    try {
      setSelectedUser(user);
      const res = await adminService.getUserDocuments(user.id);
      setUserDocs(res.data);
    } catch (err) {
      console.error('Error fetching user docs:', err);
      alert('Failed to fetch user documents');
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-12 rounded-2xl shadow-xl text-center max-w-md w-full mx-4 border border-red-100">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fa-solid fa-shield-halved text-2xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Unauthorized Access</h1>
          <p className="text-gray-600 mb-8">You need administrator privileges to view this section.</p>
          <Link to="/" className="w-full py-3 px-6 bg-[#00668c] text-white font-bold rounded-lg hover:bg-[#004d6a] transition-all">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-slate-900 text-white py-12">
        <div className="container-custom">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight">Admin Control Center</h1>
              <p className="text-slate-400 mt-2">Manage users, documents, and system overview.</p>
            </div>
            <div className="bg-indigo-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Admin Session Active
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-custom">
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Total Users', value: stats.users, icon: 'fa-users', color: 'blue' },
              { label: 'Consultations', value: stats.consultations || 0, icon: 'fa-calendar-check', color: 'amber' },
              { label: 'Total Orders', value: stats.orders || 0, icon: 'fa-shopping-cart', color: 'emerald' },
              { label: 'Client Docs', value: stats.documents || 0, icon: 'fa-file-lines', color: 'indigo' }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group">
                <div className={`absolute top-0 right-0 p-4 transition-transform group-hover:scale-110`}>
                  <i className={`fa-solid ${stat.icon} text-4xl opacity-5`}></i>
                </div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{stat.label}</h3>
                <p className="text-3xl font-black text-gray-900 mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Management List */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-white sticky top-0">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <i className="fa-solid fa-users-gear text-slate-400"></i>
                    User Directory
                  </h2>
                  <button onClick={fetchAdminData} className="text-slate-400 hover:text-indigo-600 transition-colors">
                    <i className="fa-solid fa-arrows-rotate"></i>
                  </button>
                </div>
                <div className="max-h-[600px] overflow-y-auto p-6 pt-0">
                  {loading ? (
                    <div className="text-center py-20 bg-gray-50 rounded-xl mt-6">
                      <i className="fa-solid fa-circle-notch fa-spin text-indigo-600 text-3xl mb-4"></i>
                      <p className="text-gray-500 font-medium">Synchronizing user data...</p>
                    </div>
                  ) : users.length > 0 ? (
                    <table className="w-full text-left">
                      <thead className="sticky top-0 bg-white z-10 pt-4">
                        <tr className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                          <th className="py-4">User Details</th>
                          <th className="py-4">Role</th>
                          <th className="py-4 text-right">Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {users.map((u) => (
                          <tr key={u.id} className={`group hover:bg-slate-50 transition-colors cursor-pointer ${selectedUser?.id === u.id ? 'bg-indigo-50/50' : ''}`} onClick={() => viewUserDocs(u)}>
                            <td className="py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-bold text-sm">
                                  {u.full_name?.charAt(0) || 'U'}
                                </div>
                                <div>
                                  <p className="font-bold text-gray-900">{u.full_name}</p>
                                  <p className="text-xs text-gray-500">{u.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4">
                              <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${u.role === 'admin' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="py-4 text-right">
                              <button className="text-slate-400 group-hover:text-indigo-600 transition-all">
                                <i className="fa-solid fa-folder-tree text-lg"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-center py-12 text-gray-400">No users found in database.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Document Viewer (Contextual) */}
            <div className="space-y-6">
              {selectedUser ? (
                <div className="bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden sticky top-8">
                  <div className="bg-indigo-600 p-6 text-white">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-black uppercase tracking-widest text-xs opacity-75">Document Archive</h3>
                      <button onClick={() => setSelectedUser(null)} className="hover:rotate-90 transition-transform">
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                    <p className="text-xl font-bold truncate">{selectedUser.full_name}</p>
                    <p className="text-sm opacity-80 truncate">{selectedUser.email}</p>
                  </div>
                  <div className="p-6">
                    {userDocs.length > 0 ? (
                      <div className="space-y-4">
                        {userDocs.map(doc => (
                          <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors group">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <i className="fa-solid fa-file-pdf text-red-500 text-lg"></i>
                              <div className="overflow-hidden">
                                <p className="text-sm font-bold text-gray-800 truncate" title={doc.file_path.split('/').pop()}>
                                  {doc.file_path.split('/').pop()}
                                </p>
                                <p className="text-[10px] text-gray-400">{new Date(doc.uploaded_at).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <a 
                              href={`http://localhost:5000/${doc.file_path}`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#00668c] hover:text-white transition-all shadow-sm"
                            >
                              <i className="fa-solid fa-download text-xs"></i>
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 grayscale opacity-40">
                        <i className="fa-solid fa-box-open text-4xl mb-4"></i>
                        <p className="text-sm font-bold">Workspace Empty</p>
                        <p className="text-[11px]">User hasn't uploaded any documents yet.</p>
                      </div>
                    )}
                  </div>
                  <div className="p-6 bg-slate-50 border-t border-gray-100">
                    <button className="w-full py-2 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-700 transition-colors uppercase tracking-widest">
                      Send Secure Message
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-2xl p-8 text-center sticky top-8">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 text-indigo-500">
                    <i className="fa-solid fa-magnifying-glass text-2xl"></i>
                  </div>
                  <h3 className="text-indigo-900 font-bold mb-2">Select a user</h3>
                  <p className="text-indigo-600/70 text-xs leading-relaxed">
                    Choose a client from the directory to inspect their documentation, subscription history, and service status.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminPanel;
