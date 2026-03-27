import React from 'react';
import Logo from './Logo';

const Loading = ({ fullScreen = true }) => {
  return (
    <div className={`flex flex-col items-center justify-center bg-slate-950 z-[2000] overflow-hidden ${fullScreen ? 'fixed inset-0 w-screen h-screen' : 'w-full py-24 rounded-[3rem] my-8'}`}>
      
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-red blur-[120px] rounded-full"></div>
      </div>
      
      <div className="relative group">
        {/* Cinematic Scan Line Animation */}
        <div className="absolute -inset-4 border border-white/10 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-red/40 to-transparent h-1/2 w-full animate-scan"></div>
        </div>

        {/* Logo with Soft Pulse */}
        <div className="relative px-12 py-8 bg-black/40 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl animate-pulse-gentle">
           <Logo className="h-24 md:h-32 w-auto filter drop-shadow-[0_0_30px_rgba(211,47,47,0.4)]" />
        </div>

        {/* corner accents */}
        <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-primary-red rounded-tl-lg opacity-50"></div>
        <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-primary-red rounded-br-lg opacity-50"></div>
      </div>

      {/* Loading Progress & Text */}
      <div className="mt-16 flex flex-col items-center gap-6 relative z-10">
        <div className="flex flex-col items-center">
            <h2 className="text-[10px] font-black text-white uppercase tracking-[0.5em] mb-3 animate-shimmer whitespace-nowrap">
                Initializing <span className="text-primary-red">Cinematic</span> Experience
            </h2>
            <p className="text-[8px] font-bold text-white/30 uppercase tracking-[0.3em] font-mono italic">Syncing with global vaults...</p>
        </div>

        {/* Premium Progress Bar */}
        <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
            <div className="absolute inset-0 bg-primary-red w-full animate-loading-bar origin-left"></div>
            <div className="absolute inset-0 bg-white/20 w-1/4 animate-loading-shimmer"></div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        @keyframes pulse-gentle {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.02); opacity: 1; }
        }
        @keyframes loading-bar {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.7); }
          100% { transform: scaleX(1); }
        }
        @keyframes loading-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
        .animate-pulse-gentle {
          animation: pulse-gentle 4s ease-in-out infinite;
        }
        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }
        .animate-loading-shimmer {
          animation: loading-shimmer 1.5s linear infinite;
        }
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Loading;
