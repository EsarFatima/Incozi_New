import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

function Auth() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'client',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = isLogin
        ? await login(formData.email, formData.password)
        : await register(formData);

      if (result.success) {
        navigate('/dashboard');
      } else {
        alert(result.error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-200 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 lg:p-10 border border-bg-300">
        <h1 className="text-3xl font-bold text-center mb-2 text-text-100">
          {isLogin ? 'Sign In' : 'Create Account'}
        </h1>
        <p className="text-center text-text-200 mb-8">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-accent-200 font-bold hover:underline"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-bold mb-2 text-text-100 uppercase tracking-wide">Full Name</label>
              <input
                type="text"
                name="full_name" // Changed from 'name' to 'full_name' for consistency with backend
                value={formData.full_name || formData.name || ''}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-bg-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-200 focus:border-transparent transition-all"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-bold mb-2 text-text-100 uppercase tracking-wide">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-bg-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-200 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-text-100 uppercase tracking-wide">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-bg-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-200 focus:border-transparent transition-all"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-bold mb-2 text-text-100 uppercase tracking-wide">Account Type</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-bg-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-200 focus:border-transparent transition-all appearance-none bg-white"
              >
                <option value="client">Client</option>
                <option value="consultant">Consultant</option>
              </select>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-200 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:bg-accent-200/90 transition-all disabled:opacity-50 text-lg"
            >
              {loading ? 'Loading...' : isLogin ? 'Log In' : 'Create Account'}
            </button>
          </div>
          
          {isLogin && (
            <div className="text-center mt-6">
              <Link to="/forgot-password" title="Coming soon" className="text-sm text-text-200 hover:text-accent-200 transition-colors">
                Forgot your password?
              </Link>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Auth;
