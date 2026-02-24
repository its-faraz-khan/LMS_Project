import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState('email'); // 'email' | 'otp' | 'reset' | 'done'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [verifiedOtp, setVerifiedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) { setError('Please enter your email.'); return; }
    setLoading(true); setError('');
    try {
      await authAPI.forgotPassword({ email });
      setStep('otp');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.');
    } finally { setLoading(false); }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) { setOtp(pasted.split('')); inputRefs.current[5]?.focus(); }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) { setError('Enter the complete 6-digit OTP.'); return; }
    setLoading(true); setError('');
    try {
      await authAPI.verifyEmail({ email, otp_code: code, purpose: 'forgot_password' });
      setVerifiedOtp(code);
      setStep('reset');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid or expired OTP.');
    } finally { setLoading(false); }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (!newPassword || !confirmPassword) { setError('Please fill in all fields.'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/.test(newPassword)) {
      setError('Password must have uppercase, lowercase, number, and special character.');
      return;
    }
    setLoading(true);
    try {
      await authAPI.resetPassword({ email, otp_code: verifiedOtp, new_password: newPassword, confirm_password: confirmPassword });
      setStep('done');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.new_password?.[0] || 'Something went wrong.');
    } finally { setLoading(false); }
  };

  const handleResendOTP = async () => {
    setLoading(true); setError('');
    try {
      await authAPI.resendOTP({ email, purpose: 'forgot_password' });
      setError('✓ New OTP sent! Check your terminal.');
    } catch { setError('Failed to resend.'); }
    finally { setLoading(false); }
  };

  const steps = ['email', 'otp', 'reset'];
  const currentIdx = steps.indexOf(step);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-slide">
        <div className="text-center mb-6">
          <span className="logo-mark text-3xl">uu</span>
          <p className="text-xs text-gray-400 mt-1">UET Learning Management System</p>
        </div>

        {step !== 'done' && (
          <div className="flex items-center justify-center mb-6 gap-2">
            {steps.map((s, i) => (
              <React.Fragment key={s}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  currentIdx > i ? 'bg-green-500 text-white' : currentIdx === i ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  {currentIdx > i ? '✓' : i + 1}
                </div>
                {i < 2 && <div className={`h-0.5 w-10 ${currentIdx > i ? 'bg-green-400' : 'bg-gray-200'}`} />}
              </React.Fragment>
            ))}
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${step === 'done' ? 'bg-green-100 text-green-600' : 'bg-primary/10 text-primary'}`}>
              {step === 'email' && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
              {step === 'otp' && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
              {step === 'reset' && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>}
              {step === 'done' && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            </div>
            <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: 'Merriweather, serif' }}>
              {step === 'email' && 'Forgot Password?'}
              {step === 'otp' && 'Enter OTP'}
              {step === 'reset' && 'Set New Password'}
              {step === 'done' && 'Password Reset!'}
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              {step === 'email' && 'Enter your university email to receive a reset OTP.'}
              {step === 'otp' && `6-digit OTP for ${email} — check your terminal (dev mode)`}
              {step === 'reset' && 'Create a strong new password for your account.'}
              {step === 'done' && 'Your password has been reset. Redirecting to login...'}
            </p>
          </div>

          {step === 'otp' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 text-sm text-amber-700">
              📟 <strong>Dev mode:</strong> OTP is printed to your Django server terminal, not sent via email.
            </div>
          )}

          {error && (
            <div className={`mb-4 text-sm px-4 py-3 rounded-xl border ${
              error.startsWith('✓')
                ? 'text-green-700 bg-green-50 border-green-200'
                : 'text-red-600 bg-red-50 border-red-200'
            }`}>{error}</div>
          )}

          {step === 'email' && (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <input type="email" placeholder="University Email" value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                className="form-input" autoFocus />
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Sending OTP...</span> : 'Send OTP'}
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="flex gap-3 justify-center" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input key={i} ref={el => inputRefs.current[i] = el} type="text" inputMode="numeric"
                    maxLength={1} value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    className="otp-input" autoFocus={i === 0} />
                ))}
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Verifying...</span> : 'Verify OTP'}
              </button>
              <p className="text-center text-sm text-gray-500">
                Didn't receive it?{' '}
                <button type="button" onClick={handleResendOTP} className="text-primary font-semibold hover:underline">Resend OTP</button>
              </p>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} placeholder="New Password"
                  value={newPassword} onChange={e => setNewPassword(e.target.value)}
                  className="form-input pr-12" autoFocus />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d={showPass ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21"
                        : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      } />
                  </svg>
                </button>
              </div>
              <input type="password" placeholder="Confirm New Password"
                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                className="form-input" />
              <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3 space-y-1">
                {[
                  ['At least 8 characters', newPassword.length >= 8],
                  ['Uppercase letter', /[A-Z]/.test(newPassword)],
                  ['Lowercase letter', /[a-z]/.test(newPassword)],
                  ['Number', /\d/.test(newPassword)],
                  ['Special character', /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)],
                ].map(([label, pass]) => (
                  <div key={label} className={`flex items-center gap-2 ${pass ? 'text-green-600' : 'text-gray-400'}`}>
                    <span className="font-bold">{pass ? '✓' : '○'}</span><span>{label}</span>
                  </div>
                ))}
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}

          {step === 'done' && (
            <div className="text-center py-4">
              <div className="text-green-500 text-5xl mb-4 animate-bounce">✓</div>
              <p className="text-gray-600">Redirecting to login page in a moment...</p>
            </div>
          )}

          <p className="text-center text-sm text-gray-500 mt-5">
            <Link to="/login" className="text-primary font-semibold hover:underline">← Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
