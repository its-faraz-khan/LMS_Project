import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import OTPModal from '../components/OTPModal';
import IllustrationPanel from '../components/IllustrationPanel';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, continueAsGuest } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP verification state (if unverified student tries to login)
  const [showOTP, setShowOTP] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await authAPI.login(form);
      login({ access: res.data.access, refresh: res.data.refresh }, res.data.user);
      navigate('/');
    } catch (err) {
      const data = err.response?.data;
      if (data?.require_verification) {
        setPendingEmail(data.email);
        setShowOTP(true);
      } else {
        setError(data?.error || 'Invalid email or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    continueAsGuest();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row"
           style={{ minHeight: '600px' }}>

        {/* Left – Illustration */}
        <IllustrationPanel />

        {/* Right – Form */}
        <div className="flex-1 flex flex-col justify-center px-8 py-12 lg:px-14 animate-fade-slide">
          {/* Logo top-right (mobile) */}
          <div className="lg:hidden mb-8 text-center">
            <span className="logo-mark">uu</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold text-center mb-2"
              style={{ fontFamily: 'Merriweather, serif', color: '#1B4D3E' }}>
            Welcome Back!
          </h1>
          <p className="text-gray-500 text-center mb-8 text-sm leading-relaxed">
            Log in to continue your journey toward clarity,<br className="hidden sm:block" />
            balance and to your Safe Space.
          </p>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                name="email"
                placeholder="University Email"
                value={form.email}
                onChange={handleChange}
                className="form-input"
                autoComplete="email"
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="form-input pr-12"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <label className="toggle">
                  <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
                  <span className="toggle-slider" />
                </label>
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-gray-500 hover:text-primary transition-colors font-medium">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Logging in...
                </span>
              ) : 'Log in'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <hr className="flex-1 border-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <hr className="flex-1 border-gray-200" />
          </div>

          {/* Guest login */}
          <button onClick={handleGuest} className="btn-secondary">
            Continue as Guest
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            Not a member?{' '}
            <Link to="/signup" className="text-primary font-semibold hover:underline">
              Join now
            </Link>
          </p>
        </div>
      </div>

      {/* OTP Modal for unverified email */}
      {showOTP && (
        <OTPModal
          email={pendingEmail}
          purpose="verify_email"
          onSuccess={() => {
            setShowOTP(false);
            setError('Email verified! Please log in again.');
          }}
          onClose={() => setShowOTP(false)}
        />
      )}
    </div>
  );
}
