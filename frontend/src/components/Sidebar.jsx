import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>, label: 'Home', path: '/' },
    { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>, label: 'Campuses', path: '/campuses' },
    { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>, label: 'Enrollments', path: '/enrollments' },
    { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>, label: 'Classrooms', path: '/classrooms' },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col sticky top-0 overflow-y-auto">
      {/* Brand */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-[#1B4D3E] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#1B4D3E]/20">
            <span className="text-xl font-bold">U</span>
          </div>
          <div>
            <span className="text-lg font-black text-[#1B4D3E] tracking-tight">UET Learning</span>
            <div className="flex items-center gap-1 -mt-1">
              <div className="w-1 h-1 rounded-full bg-[#F26522]" />
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">AI Hub</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-gray-50 text-[#1B4D3E] shadow-sm' 
                  : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}
              `}
            >
              <div className={`transition-colors duration-200 ${window.location.pathname === item.path ? 'text-[#1B4D3E]' : 'text-gray-400 group-hover:text-gray-600'}`}>
                {item.icon}
              </div>
              <span className={`text-sm font-bold tracking-tight ${window.location.pathname === item.path ? 'text-gray-800' : ''}`}>{item.label}</span>
              {window.location.pathname === item.path && (
                <div className="ml-auto w-1 h-5 rounded-full bg-[#1B4D3E]" />
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User info & Logout */}
      <div className="mt-auto p-6 space-y-4">
        <div className="bg-[#1B4D3E] rounded-[24px] p-4 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-white shadow-inner overflow-hidden">
              {user?.profile_pic ? (
                <img 
                  src={user.profile_pic.startsWith('http') ? user.profile_pic : `http://localhost:8000${user.profile_pic}`} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.username?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate">{user?.username || 'Guest User'}</p>
              <p className="text-[10px] text-white/60 truncate capitalize">{user?.role || 'Guest'}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors relative z-10"
          >
            Manage Profile
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
}
