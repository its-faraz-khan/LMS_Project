import React from 'react';
import Sidebar from '../components/Sidebar';

export default function CampusesPage() {
  const campuses = [
    { 
      name: 'Main Campus (Lahore)', 
      details: 'The historic heart of engineering excellence. Established in 1921, the Main Campus features iconic red-brick architecture and state-of-the-art research facilities.', 
      image: '',
      location: 'Grand Trunk Road, Lahore',
      established: '1921'
    },
    { 
      name: 'KSK Campus', 
      details: 'A cutting-edge research hub located at Kala Shah Kaku. This campus focuses on advanced technology, energy research, and environmental engineering.', 
      image: '',
      location: 'Kala Shah Kaku, Sheikhupura',
      established: '2006'
    },
    { 
      name: 'Faisalabad Campus', 
      details: 'Strategically located in Pakistan\'s industrial hub, providing specialized engineering education tailored to the textile and manufacturing sectors.', 
      image: '',
      location: 'Faisalabad',
      established: '2004'
    },
    { 
      name: 'Gujranwala Campus', 
      details: 'Serving the "Golden Triangle" of Pakistan. It offers diverse engineering programs designed to support the region\'s vibrant small and medium enterprises.', 
      image: '',
      location: 'Gujranwala',
      established: '2003'
    },
    { 
      name: 'Narowal Campus', 
      details: 'Our newest addition, featuring modern architectural design and focusing on bringing high-quality technical education to the youth of the Narowal region.', 
      image: '',
      location: 'Narowal',
      established: '2012'
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#F0F2F5]">
      <Sidebar />
      <main className="flex-1 flex flex-col min-h-screen">
        <div className="p-8 lg:p-12 overflow-y-auto">
          {/* Header Section */}
          <div className="mb-12">
            <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-2">Academic Ecosystem</h2>
            <h1 className="text-4xl font-black text-gray-800" style={{ fontFamily: 'Merriweather, serif' }}>
              Explore Our Campuses
            </h1>
            <p className="text-gray-400 text-sm mt-4 max-w-2xl font-medium leading-relaxed">
              UET Lahore spans across multiple strategically located campuses, each offering a unique environment for learning, research, and self-discovery.
            </p>
          </div>

          {/* Campus Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {campuses.map((campus, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-gray-50 flex flex-col group hover:shadow-2xl hover:shadow-[#1B4D3E]/10 transition-all duration-500 hover:-translate-y-2"
              >
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={campus.image} 
                    alt={campus.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  
                  {/* Establishment Badge */}
                  <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md border border-white/30 px-4 py-2 rounded-2xl">
                     <p className="text-[9px] text-white font-black uppercase tracking-widest">Est. {campus.established}</p>
                  </div>

                  <div className="absolute bottom-6 left-8">
                     <p className="text-[10px] text-white/80 font-black uppercase tracking-widest mb-1">Campus ID: 00{idx + 1}</p>
                     <h3 className="text-xl font-bold text-white">{campus.name}</h3>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-xl bg-[#1B4D3E]/10 flex items-center justify-center text-[#1B4D3E]">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{campus.location}</p>
                  </div>

                  <p className="text-sm text-gray-500 leading-relaxed description-fade">
                    {campus.details}
                  </p>

                  <div className="mt-auto pt-8 flex items-center justify-between">
                    <button className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
                       Visit Website 
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </button>
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-[#1B4D3E] group-hover:text-white transition-all cursor-pointer">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-auto px-12 py-6 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-bold uppercase tracking-widest bg-white/50 backdrop-blur-sm">
            <span>UET LMS v1.0 • Global Campus Network</span>
            <span>© 2026 University of Engineering & Technology</span>
        </div>
      </main>
    </div>
  );
}
