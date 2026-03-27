import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const AnnouncementBar = () => {
  const { announcements } = useData();
  const [isHovered, setIsHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (announcements.length === 0) return;
    if (currentIndex >= announcements.length) setCurrentIndex(0);
    
    if (isHovered) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [announcements, isHovered, currentIndex]);

  if (announcements.length === 0) return null;

  return (
    <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-full bg-gradient-to-r from-slate-900 via-[#1a1f2e] to-slate-900 border-y border-slate-700/50 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.12)] group cursor-pointer relative z-20"
    >
        <div className="w-full max-w-[1800px] mx-auto flex items-center h-10 lg:h-12 relative">
            {/* Glowing effect behind breaking badge */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-[#e61e25]/20 blur-xl pointer-events-none"></div>

            {/* Breaking Tag */}
            <div className="bg-gradient-to-r from-[#e61e25] to-[#cc181f] shadow-[0_0_20px_rgba(230,30,37,0.4)] text-white px-4 lg:px-6 h-full flex items-center gap-2 shrink-0 z-20 relative">
                <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-white rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]"></span>
                <span className="font-black text-[9px] lg:text-[11px] uppercase tracking-[0.2em] italic">Breaking</span>
            </div>

            {/* News Content */}
            <div className="flex-1 px-4 lg:px-8 overflow-hidden relative flex items-center h-full">
                <div className="md:hidden w-full overflow-hidden">
                    {announcements[currentIndex].link ? (
                        <Link 
                            to={announcements[currentIndex].link}
                            className="animate-marquee inline-block text-white font-bold text-[11px] italic hover:text-primary-red transition-colors no-underline whitespace-nowrap pr-[100%]"
                        >
                            {announcements[currentIndex].text}
                        </Link>
                    ) : (
                        <div className="animate-marquee inline-block text-white font-bold text-[11px] italic whitespace-nowrap pr-[100%]">
                            {announcements[currentIndex].text}
                        </div>
                    )}
                </div>

                <div className="hidden md:block w-full">
                    {announcements[currentIndex].link ? (
                        <Link 
                            to={announcements[currentIndex].link}
                            key={currentIndex} 
                            className="animate-slide-up text-white/90 text-[13px] font-bold whitespace-nowrap italic block hover:text-primary-red transition-colors no-underline"
                        >
                            {announcements[currentIndex].text}
                        </Link>
                    ) : (
                        <div key={currentIndex} className="animate-slide-up text-white/90 text-[13px] font-bold whitespace-nowrap italic">
                            {announcements[currentIndex].text}
                        </div>
                    )}
                </div>
            </div>

            {/* Date Tag */}
            <div className="flex items-center px-3 lg:px-5 h-full relative z-20 shrink-0">
                <div className="flex items-center gap-2 md:gap-3 bg-gradient-to-b from-slate-800 to-slate-950 border border-slate-700/50 border-t-slate-600/50 shadow-[0_4px_10px_rgba(0,0,0,0.4),inset_0_2px_5px_rgba(255,255,255,0.05)] rounded-xl px-4 py-2 transition-all cursor-default">
                    <i className="far fa-clock text-primary-red hidden sm:block text-sm drop-shadow-[0_0_5px_rgba(230,30,37,0.4)]"></i>
                    <div className="flex flex-col sm:flex-row sm:gap-2 items-end sm:items-center uppercase text-[9px] lg:text-xs">
                        <span className="text-slate-100 font-black tracking-wider [text-shadow:0_1px_1px_rgba(0,0,0,0.8)]">
                            {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="hidden sm:block text-slate-600">•</span>
                        <span className="text-[#ea2e35] font-black tracking-widest [text-shadow:0_1px_2px_rgba(0,0,0,1)]">
                            {currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default AnnouncementBar;
