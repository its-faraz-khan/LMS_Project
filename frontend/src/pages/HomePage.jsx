import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

export default function HomePage() {
  const { user, isGuest } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('Guided'); // 'Guided' or 'Autonomy'

  const subjects = [
    { name: 'Physics', lessons: 90, covered: 35, progress: 60, color: '#FFC107', icon: '⚛️' },
    { name: 'Chemistry', lessons: 90, covered: 35, progress: 60, color: '#EF5350', icon: '🧪' },
    { name: 'Biology', lessons: 90, covered: 35, progress: 60, color: '#F26522', icon: '🧬' },
    { name: 'Mathematics', lessons: 90, covered: 35, progress: 60, color: '#1B4D3E', icon: 'f(x)' },
  ];

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  return (
    <div className="flex min-h-screen bg-[#F0F2F5]">
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top Dark Header Bar */}
        <div className="bg-[#1B4D3E] mx-6 mt-6 p-4 rounded-2xl flex items-center justify-between shadow-2xl shadow-[#1B4D3E]/20">
          {/* Search Bar */}
          <div className="relative w-96 ml-2">
            <input 
              type="text" 
              placeholder="Search subjects, campus, info..." 
              className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 rounded-xl py-3 pl-12 pr-4 text-xs font-semibold focus:outline-none focus:bg-white/20 transition-all"
            />
            <svg className="absolute left-4 top-3.5 w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex items-center gap-6 mr-2">
            {/* Date Display */}
            <span className="text-white/80 text-[11px] font-bold uppercase tracking-widest hidden lg:block">
              {today}
            </span>

            {/* Icons */}
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white transition-all relative group">
                <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#F26522] rounded-full border-2 border-[#1B4D3E] group-hover:scale-120 transition-transform" />
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </button>
              <button className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white transition-all relative group">
                <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#F26522] rounded-full border-2 border-[#1B4D3E] group-hover:scale-120 transition-transform" />
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex-1 p-8 lg:px-12 pt-8 overflow-y-auto">
          {/* Main Title Section */}
          <div className="mb-10">
            <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2 px-1">Dashboard Overview</h2>
            <h1 className="text-3xl font-black text-gray-800" style={{ fontFamily: 'Merriweather, serif' }}>
              UET AI Learning Hub
            </h1>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column: Subjects */}
            <div className="xl:col-span-2 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800">What subject you are interested today?</h3>
                <div className="bg-white p-1 rounded-full shadow-sm flex items-center gap-1 border border-gray-100">
                  {['Guided', 'Autonomy'].map(mode => (
                    <button
                      key={mode}
                      onClick={() => setFilter(mode)}
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all ${
                        filter === mode ? 'bg-[#F26522] text-white shadow-md' : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {subjects.map((subject, idx) => (
                  <div key={idx} className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50 flex items-center gap-6 group hover:shadow-xl hover:shadow-[#1B4D3E]/5 transition-all duration-300">
                    <div 
                      className="w-20 h-20 rounded-3xl flex items-center justify-center text-2xl shadow-inner relative flex-shrink-0"
                      style={{ backgroundColor: `${subject.color}15` }}
                    >
                      <div className="z-10 bg-white/60 backdrop-blur-sm w-14 h-14 rounded-2xl flex items-center justify-center font-bold" style={{ color: subject.color }}>
                        {subject.icon}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="truncate">
                          <h4 className="text-base font-bold text-gray-800 truncate">{subject.name}</h4>
                          <p className="text-[10px] text-gray-400 font-bold">{subject.covered}/{subject.lessons} Lessons</p>
                        </div>
                        <button className="w-7 h-7 rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 bg-gray-50 text-gray-400 hover:bg-primary hover:text-white">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </button>
                      </div>
                      
                      <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-1000"
                          style={{ width: `${subject.progress}%`, backgroundColor: subject.color }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#1B4D3E] rounded-[32px] p-8 text-white relative overflow-hidden group">
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full -mb-32 -mr-32 transition-transform group-hover:scale-110" />
                <div className="relative z-10 flex items-center justify-between">
                  <div className="max-w-md">
                    <h3 className="text-2xl font-black mb-4">Master Your Studies with AI</h3>
                    <p className="text-white/60 text-sm leading-relaxed mb-6">Explore our campus resources or jump back into your enrolled courses to start learning with the AI assistant.</p>
                    <button 
                      onClick={() => navigate('/campuses')}
                      className="px-8 py-3 bg-[#F26522] text-white font-bold rounded-2xl shadow-xl shadow-[#F26522]/30 hover:bg-[#d94f0e] transition-all"
                    >
                      Explore Campuses
                    </button>
                  </div>
                  <div className="hidden md:block text-8xl opacity-20">📚</div>
                </div>
              </div>
            </div>

            {/* Right Column: User Quick View */}
            <div className="space-y-8">
              <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-50">
                <h3 className="text-lg font-bold text-gray-800 mb-8 px-2">Academic Profile</h3>
                
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="w-24 h-24 rounded-full border-4 border-[#1B4D3E]/10 p-1 mb-4">
                    <div className="w-full h-full rounded-full bg-gray-50 flex items-center justify-center text-3xl font-black text-primary overflow-hidden shadow-inner">
                      {user?.profile_pic ? (
                        <img 
                          src={user.profile_pic.startsWith('http') ? user.profile_pic : `http://localhost:8000${user.profile_pic}`} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        user?.username?.charAt(0).toUpperCase() || 'U'
                      )}
                    </div>
                  </div>
                  <h4 className="text-xl font-black text-gray-800">{user?.username || 'UET Student'}</h4>
                  <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1">{user?.role || 'Guest'}</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Registration</p>
                      <p className="text-sm font-bold text-gray-800">{user?.registration_number || 'N/A'}</p>
                    </div>
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#F26522]">ID</div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Email Status</p>
                      <p className="text-sm font-bold text-gray-800">{user?.is_verified ? 'Verified' : 'Pending'}</p>
                    </div>
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-green-500">✓</div>
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/profile')}
                  className="w-full mt-8 py-4 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold rounded-2xl text-[11px] uppercase tracking-widest transition-all"
                >
                  Edit Profile
                </button>
              </div>

              {/* Quick Quote */}
              <div className="bg-white/40 backdrop-blur-xl border border-white rounded-[32px] p-8 text-center italic shadow-sm">
                <p className="text-gray-500 text-sm">"The beautiful thing about learning is that no one can take it away from you."</p>
                <p className="text-[10px] font-black text-primary mt-4 uppercase tracking-widest">— B.B. King</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-12 py-4 flex items-center justify-between text-[11px] text-gray-500 font-bold uppercase tracking-widest">
            <span>UET LMS v1.0</span>
            <span>© 2026 University of Engineering & Technology</span>
        </div>
      </main>
    </div>
  );
}
