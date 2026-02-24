import React from 'react';

export default function IllustrationPanel() {
  return (
    <div className="hidden lg:flex flex-col relative bg-gradient-to-br from-slate-50 to-blue-50 w-5/12 items-center justify-center p-12 overflow-hidden border-r border-gray-100">
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
      
      <div className="relative z-10 w-full max-w-sm">
        <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-8 rounded-[40px] shadow-2xl shadow-primary/5 animate-fade-slide">
          {/* Main Logo/Brand */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
              <span className="text-2xl font-bold">U</span>
            </div>
            <div>
              <h2 className="text-2xl font-black text-primary leading-none" style={{ fontFamily: 'Merriweather, serif' }}>UET LMS</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">AI-Powered Learning</p>
            </div>
          </div>

          <h3 className="text-3xl font-bold text-gray-800 mb-4 leading-tight">
            Elevate Your <span className="text-primary italic">Learning</span> Experience.
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            Access your courses, track your progress, and collaborate with peers in a smart, integrated environment designed for UET students.
          </p>

          <div className="space-y-4">
            {[
              { label: 'Smart AI Assistant', color: 'bg-blue-500' },
              { label: 'Comprehensive Campus Access', color: 'bg-primary' },
              { label: 'Interactive Dashboards', color: 'bg-amber-500' }
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${feature.color}`} />
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Floating elements
        <div className="absolute -top-6 -right-6 w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center animate-float" style={{ animationDelay: '1s' }}>
          <span className="text-2xl">🎓</span>
        </div>
        <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center animate-float-slow">
          <span className="text-3xl">🤖</span>
        </div> */}
      </div>

      <div className="absolute bottom-7 text-center">
        <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.3em]">University of Engineering & Technology, Lahore</p>
      </div>
    </div>
  );
}
