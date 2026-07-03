import React from 'react';

const Loading = ({ fullScreen = true, progress = 0 }) => {
  return (
    <div className={`flex flex-col items-center justify-center bg-slate-50 ${fullScreen ? 'fixed inset-0 w-screen h-screen z-[2000]' : 'w-full py-12'}`}>
        <div className="flex flex-col items-center gap-3">
            <i className="fas fa-circle-notch fa-spin text-3xl text-primary-red"></i>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Loading...</span>
        </div>
    </div>
  );
};

export default Loading;
