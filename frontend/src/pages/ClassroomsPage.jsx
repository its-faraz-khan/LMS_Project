import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

export default function ClassroomsPage() {
  const [activeTab, setActiveTab] = useState('My Classrooms');
  
  const subjects = [
    { name: 'Physics', teacher: 'Dr. Ahmad Roy', students: 45, unread: 3, color: '#FFC107', icon: '⚛️' },
    { name: 'Chemistry', teacher: 'Prof. Sarah Khan', students: 38, unread: 0, color: '#EF5350', icon: '🧪' },
    { name: 'Mathematics', teacher: 'Dr. Usman Ali', students: 52, unread: 12, color: '#1B4D3E', icon: 'f(x)' },
  ];

  return (
    <div className="flex min-h-screen bg-[#F0F2F5]">
      <Sidebar />
      <main className="flex-1 flex flex-col min-h-screen">
        <div className="p-8 lg:p-12 overflow-y-auto">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-2">Social Learning</h2>
              <h1 className="text-3xl font-black text-gray-800" style={{ fontFamily: 'Merriweather, serif' }}>
                Your Classrooms
              </h1>
            </div>
            
            <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-100 flex gap-1">
               {['My Classrooms', 'Pending Requests'].map(tab => (
                 <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === tab ? 'bg-[#1B4D3E] text-white shadow-lg shadow-[#1B4D3E]/20' : 'text-gray-400 hover:bg-gray-50'}`}
                 >
                   {tab}
                 </button>
               ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subjects.map((classroom, idx) => (
              <div key={idx} className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-gray-50 group hover:shadow-xl hover:shadow-[#1B4D3E]/5 transition-all duration-300">
                {/* Header Color Strip */}
                <div className="h-24 relative overflow-hidden" style={{ backgroundColor: classroom.color }}>
                   <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent scale-150" />
                   <div className="absolute top-4 right-6 text-white text-4xl opacity-30 font-black">{classroom.icon}</div>
                </div>

                <div className="p-8 pt-0 -mt-8 relative z-10">
                  {/* Badge Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center text-2xl mb-6 border border-gray-50">
                    {classroom.icon}
                  </div>

                  <h3 className="text-xl font-black text-gray-800 mb-1">{classroom.name}</h3>
                  <p className="text-xs text-gray-400 font-bold mb-6">Instructor: <span className="text-gray-600">{classroom.teacher}</span></p>

                  <div className="flex items-center justify-between py-4 border-t border-gray-50">
                    <div className="flex items-center gap-2">
                       <div className="flex -space-x-2">
                          {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white" />)}
                       </div>
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">+{classroom.students} Students</span>
                    </div>
                    {classroom.unread > 0 && (
                      <div className="bg-[#F26522] text-white text-[9px] font-black px-2 py-1 rounded-lg animate-pulse">
                        {classroom.unread} NEW MSG
                      </div>
                    )}
                  </div>

                  <button className="w-full mt-4 py-4 bg-gray-50 group-hover:bg-[#1B4D3E] group-hover:text-white text-gray-800 font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all">
                    Enter Classroom
                  </button>
                </div>
              </div>
            ))}

            {/* Join New Classroom Card */}
            <div className="bg-gray-50/50 rounded-[40px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-8 text-center min-h-[400px] group cursor-pointer hover:border-[#1B4D3E]/30 transition-all">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-gray-300 mb-4 shadow-sm group-hover:text-[#1B4D3E] group-hover:scale-110 transition-all">
                   <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                </div>
                <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest group-hover:text-gray-800 transition-colors">Join New Subject</h4>
                <p className="text-[10px] text-gray-300 font-bold max-w-[180px] mt-2">Find a subject and request enrollment to access the group</p>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-auto px-12 py-6 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-300 font-bold uppercase tracking-widest">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm shadow-green-500/50" />
               <span>Interconnected campus active</span>
            </div>
            <span>© 2026 UET-LMS Hub</span>
        </div>
      </main>
    </div>
  );
}
