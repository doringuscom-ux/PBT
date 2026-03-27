import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const CelebGrid = () => {
  const { celebs } = useData();
  // Sort by total followers descending
  const sortedCelebs = [...celebs].sort((a, b) => {
    const aFollowers = (a.followers?.length || 0) + (a.bonusFollowers || 0);
    const bFollowers = (b.followers?.length || 0) + (b.bonusFollowers || 0);
    return bFollowers - aFollowers;
  });

  const displayedCelebs = sortedCelebs.slice(0, 10);

  return (
    <div className="mb-12 overflow-hidden relative">
      <style>
        {`
        @keyframes celebMarquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-200px * ${displayedCelebs.length} - 1rem * ${displayedCelebs.length})); }
        }
        .animate-celeb-marquee {
            animation: celebMarquee ${displayedCelebs.length * 3.5}s linear infinite;
            display: flex;
            width: max-content;
        }
        .celeb-marquee-container:hover .animate-celeb-marquee {
            animation-play-state: paused;
        }
        `}
      </style>

      <div className="mb-10">
        <div className="flex items-center justify-between items-end">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              <span className="text-[10px] lg:text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Popular Stars</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
              Featured <span className="text-red-600">Celebrities</span>
            </h2>
          </div>
          <Link to="/celebs" className="text-slate-900 font-black no-underline text-[10px] lg:text-[11px] uppercase tracking-widest hover:text-red-600 transition-colors flex items-center gap-2 mb-2">
            View All <i className="fas fa-arrow-right text-[10px]"></i>
          </Link>
        </div>
      </div>
      
      <div className="celeb-marquee-container relative w-full overflow-hidden py-2">
        {/* Gradient Masks for smooth fading edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#f8f9fa] to-transparent z-10 pointer-events-none hidden lg:block"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#f8f9fa] to-transparent z-10 pointer-events-none hidden lg:block"></div>
        
        <div className="animate-celeb-marquee gap-4 px-2">
          {[...displayedCelebs, ...displayedCelebs].map((celeb, idx) => (
            <Link to={`/celeb/${celeb._id}`} key={`${celeb._id}-${idx}`} className="w-[200px] shrink-0 bg-white rounded-xl shadow-md text-center hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 group no-underline text-inherit block overflow-hidden">
              <div className="relative w-full pt-[125%] overflow-hidden bg-slate-100">
                <img 
                  src={celeb.image} 
                  alt={celeb.name} 
                  className="absolute top-0 left-0 w-full h-full object-cover object-[center_top] transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-3 border-t-2 border-transparent group-hover:border-primary-red transition-colors">
                <div className="font-black text-[13px] mb-0.5 group-hover:text-primary-red transition-colors line-clamp-1 italic tracking-tight">{celeb.name}</div>
                <div className="text-primary-red text-[9px] font-black uppercase tracking-widest">{celeb.role}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CelebGrid;
