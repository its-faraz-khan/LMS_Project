import React from 'react';
import Sidebar from '../components/Sidebar';

export default function EnrollmentsPage() {
  return (
    <div className="flex min-h-screen bg-[#F0F2F5]">
      <Sidebar />
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-primary/10 rounded-[32px] flex items-center justify-center mb-6">
           <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Merriweather, serif' }}>Your Enrollments</h1>
        <p className="text-gray-500 max-w-md">
          You haven't enrolled in any courses yet. Explore the campuses to find courses that interest you!
        </p>
      </main>
    </div>
  );
}
