import React, { useState } from 'react';
import { consultationsService } from '../services/api.js';
import { useAuth } from '../hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';

function Consultation() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    service_type: 'General',
    preferred_date: '',
    preferred_time: '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please log in to book a consultation');
      return navigate('/account');
    }

    try {
      setLoading(true);
      await consultationsService.create(formData);
      alert('Consultation request submitted! We will contact you soon.');
      navigate('/dashboard');
    } catch (err) {
      console.error('Booking failed:', err);
      alert('Booking failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-[#00668c] text-white py-12">
        <div className="container-custom text-center">
          <h1 className="text-4xl font-bold mb-4">Book a Consultation</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Schedule your personalized business consultation with our seasoned experts.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-custom max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Area of Interest</label>
                <select 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00668c] transition-all"
                  value={formData.service_type}
                  onChange={(e) => setFormData({...formData, service_type: e.target.value})}
                >
                  <option value="General">General Inquiry</option>
                  <option value="Bookkeeping">Bookkeeping & Accounting</option>
                  <option value="Tax">Tax Compliance (LLC/Corp)</option>
                  <option value="Incorporation">New Incorporation (Wyoming/Delaware)</option>
                  <option value="Banking">Banking Support</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Preferred Date</label>
                  <input 
                    type="date" 
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00668c] transition-all"
                    value={formData.preferred_date}
                    onChange={(e) => setFormData({...formData, preferred_date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Preferred Time (Approx)</label>
                  <input 
                    type="time" 
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00668c] transition-all"
                    value={formData.preferred_time}
                    onChange={(e) => setFormData({...formData, preferred_time: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Specific Questions or Notes</label>
                <textarea
                  rows="4"
                  placeholder="The more details you share, the better we can prepare..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00668c] transition-all"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-[#00668c] text-white font-bold rounded-xl hover:bg-[#004d6a] transform active:scale-95 transition-all shadow-lg text-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><i className="fa-solid fa-spinner fa-spin"></i> Processing...</>
                ) : (
                  'Confirm Booking Request'
                )}
              </button>
              
              <p className="text-center text-xs text-gray-400 mt-4">
                No payment is required for this initial request. Our team will verify availability and confirm within 24 hours.
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Consultation;
