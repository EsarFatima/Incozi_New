import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { Link } from 'react-router-dom';
import { documentService } from '../services/api.js';

function Dashboard() {
  const { isAuthenticated, user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDocuments();
    }
  }, [isAuthenticated]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await documentService.getMyDocuments();
      setDocuments(res.data);
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('documents', files[i]);
    }

    try {
      setUploading(true);
      await documentService.upload(formData);
      alert('Upload successful!');
      fetchDocuments();
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

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
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-[#00668c] text-white py-12">
        <div className="container-custom">
          <h1 className="text-4xl font-bold">Client Dashboard</h1>
          <p className="text-xl opacity-90 pb-2">Welcome back, {user?.name}!</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container-custom">
          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-[#00668c] rounded-lg flex items-center justify-center">
                  <i className="fa-solid fa-calendar-check"></i>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500">Consultations</h3>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                  <i className="fa-solid fa-file-invoice-dollar"></i>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500">Services</h3>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                  <i className="fa-solid fa-folder-open"></i>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500">Documents</h3>
                  <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Document Section */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">My Documents</h2>
                  <label className="cursor-pointer bg-[#00668c] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#004d6a] transition-all">
                    {uploading ? 'Uploading...' : 'Upload New'}
                    <input 
                      type="file" 
                      className="hidden" 
                      multiple 
                      onChange={handleFileUpload}
                      disabled={uploading}
                    />
                  </label>
                </div>
                <div className="p-6">
                  {loading ? (
                    <div className="text-center py-8">Loading documents...</div>
                  ) : documents.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-xs uppercase text-gray-400 font-bold tracking-wider">
                            <th className="pb-4">Name</th>
                            <th className="pb-4">Type</th>
                            <th className="pb-4">Date</th>
                            <th className="pb-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {documents.map((doc) => (
                            <tr key={doc.id} className="text-gray-700">
                              <td className="py-4 font-medium">{doc.file_path.split('/').pop()}</td>
                              <td className="py-4 text-sm">{doc.document_type}</td>
                              <td className="py-4 text-sm">{new Date(doc.uploaded_at).toLocaleDateString()}</td>
                              <td className="py-4 text-right">
                                <a 
                                  href={`http://localhost:5000/${doc.file_path}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-[#00668c] hover:underline text-sm font-semibold"
                                >
                                  Download
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fa-solid fa-file-circle-plus text-2xl"></i>
                      </div>
                      <p className="text-gray-500">No documents found. Upload your first document to get started.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="/consultation" className="group bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:border-[#00668c] transition-all">
                  <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#00668c] group-hover:text-white transition-all">
                    <i className="fa-solid fa-handshake-angle text-xl"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Book Consultation</h3>
                  <p className="text-gray-500 text-sm">Schedule a 1-on-1 session with our legal experts.</p>
                </Link>
                <Link to="/services" className="group bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:border-[#00668c] transition-all">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#00668c] group-hover:text-white transition-all">
                    <i className="fa-solid fa-shield-halved text-xl"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Buy Services</h3>
                  <p className="text-gray-500 text-sm">Explore and purchase incorporation or tax compliance packages.</p>
                </Link>
              </div>
            </div>

            {/* Sidebar / Profile Info */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-4">Profile Information</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Email Address</p>
                    <p className="text-gray-700">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Account Type</p>
                    <p className="text-gray-700 capitalize">{user?.role || 'User'}</p>
                  </div>
                  <Link to="/profile" className="block text-center py-2 px-4 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                    Edit Profile
                  </Link>
                </div>
              </div>

              <div className="bg-[#f8fafc] p-6 rounded-xl border border-dashed border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 mb-2">Need Help?</h3>
                <p className="text-xs text-gray-500 mb-4">Our support team is available 24/7 to assist with your documents or bookings.</p>
                <a href="mailto:support@incozi.com" className="text-sm font-bold text-[#00668c] hover:underline">Contact Support</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
