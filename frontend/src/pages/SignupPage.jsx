import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import OTPModal from '../components/OTPModal';
import IllustrationPanel from '../components/IllustrationPanel';

const emailPattern = /^\d{4}[A-Za-z]+\d+@student\.uet\.edu\.pk$/;

const passwordRules = [
  { test: (v) => v.length >= 8, label: 'At least 8 characters' },
  { test: (v) => /[A-Z]/.test(v), label: 'One uppercase letter' },
  { test: (v) => /[a-z]/.test(v), label: 'One lowercase letter' },
  { test: (v) => /\d/.test(v), label: 'One number' },
  { test: (v) => /[!@#$%^&*(),.?":{}|<>]/.test(v), label: 'One special character' },
];

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: '', last_name: '', username: '',
    email: '', password: '', confirm_password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  const validate = () => {
    const errs = {};
    if (!form.first_name.trim()) errs.first_name = 'First name is required.';
    if (!form.last_name.trim()) errs.last_name = 'Last name is required.';
    if (!form.username.trim()) errs.username = 'Username is required.';
    else if (!/^[a-zA-Z0-9_]{3,20}$/.test(form.username)) errs.username = 'Username: 3-20 chars, letters/numbers/_';
    if (!form.email) errs.email = 'Email is required.';
    else if (!emailPattern.test(form.email)) errs.email = 'Must be a valid UET student email (e.g., 2024CS542@student.uet.edu.pk)';
    if (!form.password) errs.password = 'Password is required.';
    else {
      const failed = passwordRules.find(r => !r.test(form.password));
      if (failed) errs.password = failed.label + ' required.';
    }
    if (!form.confirm_password) errs.confirm_password = 'Please confirm your password.';
    else if (form.password !== form.confirm_password) errs.confirm_password = 'Passwords do not match.';
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setErrors({});
    try {
      const res = await authAPI.register(form);
      setPendingEmail(form.email);
      setShowOTP(true);
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        const apiErrors = {};
        Object.keys(data).forEach(key => {
          apiErrors[key] = Array.isArray(data[key]) ? data[key][0] : data[key];
        });
        setErrors(apiErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = form.password
    ? passwordRules.filter(r => r.test(form.password)).length
    : 0;

  const strengthColor = ['bg-red-400', 'bg-red-400', 'bg-yellow-400', 'bg-yellow-400', 'bg-green-500'][passwordStrength - 1] || 'bg-gray-200';
  const strengthLabel = ['Weak', 'Weak', 'Fair', 'Good', 'Strong'][passwordStrength - 1] || '';

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row">

        <IllustrationPanel />

        {/* Form side */}
        <div className="flex-1 flex flex-col justify-center px-8 py-10 lg:px-14 animate-fade-slide">
          <h1 className="text-3xl font-bold text-center mb-1"
              style={{ fontFamily: 'Merriweather, serif', color: '#1B4D3E' }}>
            Create Account
          </h1>
          <p className="text-gray-500 text-center mb-6 text-sm">
            Join your university learning community
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-5 text-sm text-blue-700">
            <strong>📧 Note:</strong> Enter your UET university email only<br />
            <span className="text-blue-600 text-xs">Format: 2024CS542@student.uet.edu.pk</span>
          </div>

          {errors.non_field_errors && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {errors.non_field_errors}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="text" name="first_name" placeholder="First Name"
                  value={form.first_name} onChange={handleChange}
                  className={`form-input ${errors.first_name ? 'border-red-400' : ''}`}
                />
                {errors.first_name && <p className="error-msg">{errors.first_name}</p>}
              </div>
              <div>
                <input
                  type="text" name="last_name" placeholder="Last Name"
                  value={form.last_name} onChange={handleChange}
                  className={`form-input ${errors.last_name ? 'border-red-400' : ''}`}
                />
                {errors.last_name && <p className="error-msg">{errors.last_name}</p>}
              </div>
            </div>

            {/* Username */}
            <div>
              <input
                type="text" name="username" placeholder="Username (unique)"
                value={form.username} onChange={handleChange}
                className={`form-input ${errors.username ? 'border-red-400' : ''}`}
              />
              {errors.username && <p className="error-msg">{errors.username}</p>}
            </div>

            {/* Email */}
            <div>
              <input
                type="email" name="email" placeholder="University Email (e.g., 2024CS542@student.uet.edu.pk)"
                value={form.email} onChange={handleChange}
                className={`form-input ${errors.email ? 'border-red-400' : ''}`}
              />
              {errors.email && <p className="error-msg">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password" placeholder="Create Password"
                  value={form.password} onChange={handleChange}
                  className={`form-input pr-12 ${errors.password ? 'border-red-400' : ''}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword
                    ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" /></svg>
                    : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  }
                </button>
              </div>
              {/* Password strength bar */}
              {form.password && (
                <div className="mt-1.5">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= passwordStrength ? strengthColor : 'bg-gray-200'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{strengthLabel} password</p>
                </div>
              )}
              {errors.password && <p className="error-msg">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirm_password" placeholder="Confirm Password"
                  value={form.confirm_password} onChange={handleChange}
                  className={`form-input pr-12 ${errors.confirm_password ? 'border-red-400' : ''}`}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showConfirm
                    ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" /></svg>
                    : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  }
                </button>
              </div>
              {errors.confirm_password && <p className="error-msg">{errors.confirm_password}</p>}
            </div>

            <button type="submit" className="btn-primary !mt-5" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Log in</Link>
          </p>
        </div>
      </div>

      {showOTP && (
        <OTPModal
          email={pendingEmail}
          purpose="verify_email"
          onSuccess={() => {
            setShowOTP(false);
            navigate('/login');
          }}
          onClose={() => setShowOTP(false)}
        />
      )}
    </div>
  );
}
