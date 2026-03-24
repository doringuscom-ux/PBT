import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const AnnouncementBar = () => {
  const { announcements } = useData();
  const [isHovered, setIsHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

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
        className="bg-slate-900 border-b border-white/5 overflow-hidden group cursor-pointer"
    >
        <div className="w-[96%] max-w-[1800px] mx-auto px-5 flex items-center h-10">
            <div className="bg-primary-red text-white px-3 h-full flex items-center gap-2 shrink-0">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                <span className="font-black text-[10px] uppercase tracking-widest italic">Breaking</span>
            </div>
            <div className="flex-1 px-6 overflow-hidden relative">
                {announcements[currentIndex].link ? (
                    <Link 
                        to={announcements[currentIndex].link}
                        key={currentIndex} 
                        className="animate-slide-up text-white/90 text-xs font-bold whitespace-nowrap italic block hover:text-primary-red transition-colors no-underline"
                    >
                        {announcements[currentIndex].text}
                    </Link>
                ) : (
                    <div key={currentIndex} className="animate-slide-up text-white/90 text-xs font-bold whitespace-nowrap italic">
                        {announcements[currentIndex].text}
                    </div>
                )}
            </div>
            <div className="hidden md:flex items-center gap-4 text-white/30 text-[9px] font-black uppercase tracking-widest border-l border-white/10 pl-6 h-full">
                <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
        </div>
    </div>
  );
};

export default AnnouncementBar;
