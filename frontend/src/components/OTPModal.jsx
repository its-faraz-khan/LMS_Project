import React, { useState, useRef } from 'react';
import { authAPI } from '../utils/api';

export default function OTPModal({ email, purpose, onSuccess, onClose }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async () => {
    const code = otp.join('');
    if (code.length < 6) {
      setError('Please enter the complete 6-digit OTP.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await authAPI.verifyEmail({ email, otp_code: code, purpose });
      setSuccess('Verified successfully!');
      setTimeout(() => onSuccess(), 1200);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    try {
      await authAPI.resendOTP({ email, purpose });
      setSuccess('A new OTP has been sent. Check your terminal.');
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Failed to resend OTP.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md animate-fade-slide">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-primary" style={{ fontFamily: 'Merriweather, serif' }}>
              Verify OTP
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Enter the 6-digit code sent to<br />
              <span className="font-semibold text-gray-700">{email}</span>
            </p>
            <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mt-2">
              📟 Development mode: Check your terminal for the OTP
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors ml-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* OTP inputs */}
        <div className="flex gap-3 justify-center mb-6" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => inputRefs.current[i] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              className="otp-input"
            />
          ))}
        </div>

        {error && <p className="error-msg text-center mb-3">{error}</p>}
        {success && <p className="success-msg text-center mb-3">{success}</p>}

        <button onClick={handleSubmit} className="btn-primary" disabled={loading}>
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Verifying...
            </span>
          ) : 'Verify OTP'}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Didn't receive it?{' '}
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-primary font-semibold hover:underline disabled:opacity-50"
          >
            {resending ? 'Resending...' : 'Resend OTP'}
          </button>
        </p>
      </div>
    </div>
  );
}
