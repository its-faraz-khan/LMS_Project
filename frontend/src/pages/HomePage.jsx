import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { user, isGuest, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="logo-mark text-2xl">uu</span>
            <span className="text-sm text-gray-400 font-medium hidden sm:block">UET Learning Management System</span>
          </div>
          <div className="flex items-center gap-4">
            {isGuest ? (
              <span className="text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">
                Guest Mode
              </span>
            ) : (
              <span className="text-sm text-gray-600 font-medium">
                {user?.first_name ? `${user.first_name} ${user.last_name}` : user?.username}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-red-500 transition-colors font-medium"
            >
              Log out
            </button>
          </div>
        </div>
      </nav>

      {/* Empty Home Content */}
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-primary mb-3" style={{ fontFamily: 'Merriweather, serif' }}>
          Welcome{user?.first_name ? `, ${user.first_name}` : isGuest ? ', Guest' : ''}!
        </h1>
        <p className="text-gray-500 max-w-md">
          {isGuest
            ? "You're browsing as a guest. Sign up with your UET email to access all features."
            : "Your dashboard is being set up. More features are coming soon."}
        </p>

        {isGuest && (
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => navigate('/signup')}
              className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors"
            >
              Create Account
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-3 bg-white border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              Log In
            </button>
          </div>
        )}

        {user && (
          <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 max-w-sm w-full text-left">
            <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Your Info</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span className="text-gray-400">Role</span>
                <span className="capitalize font-medium text-primary">{user.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Email</span>
                <span className="font-medium">{user.email}</span>
              </div>
              {user.registration_number && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Reg. No.</span>
                  <span className="font-medium">{user.registration_number}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400">Username</span>
                <span className="font-medium">@{user.username}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
