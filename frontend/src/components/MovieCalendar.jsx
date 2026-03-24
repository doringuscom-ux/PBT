import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const MOCK_UPCOMING_MOVIES = [
  { _id: 'mock1', title: 'Amar Singh Chamkila 2', genre: 'Biography/Music', releaseDate: '2026-04-15', image: 'https://res.cloudinary.com/dzvk7womv/image/upload/v1711287600/chamkila_dummy.jpg' },
  { _id: 'mock2', title: 'Jatt & Juliet 4', genre: 'Comedy/Romance', releaseDate: '2026-05-22', image: 'https://res.cloudinary.com/dzvk7womv/image/upload/v1711287600/jatt_juliet_dummy.jpg' },
  { _id: 'mock3', title: 'Pushpa 3: The Rule', genre: 'Action/Drama', releaseDate: '2026-08-15', image: 'https://res.cloudinary.com/dzvk7womv/image/upload/v1711287600/pushpa_dummy.jpg' },
  { _id: 'mock4', title: 'Carry on Jatta 4', genre: 'Comedy', releaseDate: '2026-06-10', image: 'https://res.cloudinary.com/dzvk7womv/image/upload/v1711287600/carry_on_jatta_dummy.jpg' }
];

const MovieCalendar = () => {
  const { movies } = useData();
  const scrollRef = useRef(null);

  // Merge real movies with mock movies for immediate testing visibility
  const allMovies = [...MOCK_UPCOMING_MOVIES, ...movies];

  const upcomingMovies = allMovies
    .filter(movie => movie.releaseDate && new Date(movie.releaseDate) > new Date())
    .sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));

  if (upcomingMovies.length === 0) return null;

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = 300;
      current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  React.useEffect(() => {
    const slider = scrollRef.current;
    if (!slider || upcomingMovies.length === 0) return;

    let intervalId = null;
    const scrollStep = 1;
    const scrollSpeed = 30;

    const startScrolling = () => {
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (!slider) return;
        slider.scrollLeft += scrollStep;
        
        if (slider.scrollLeft >= slider.scrollWidth - slider.clientWidth - 1) {
          slider.scrollLeft = 0;
        }
      }, scrollSpeed);
    };

    startScrolling();

    const handleMouseEnter = () => {
        if (intervalId) clearInterval(intervalId);
    };
    const handleMouseLeave = () => startScrolling();

    slider.addEventListener('mouseenter', handleMouseEnter);
    slider.addEventListener('mouseleave', handleMouseLeave);
    slider.addEventListener('touchstart', handleMouseEnter, { passive: true });
    slider.addEventListener('touchend', handleMouseLeave, { passive: true });

    return () => {
      if (intervalId) clearInterval(intervalId);
      slider.removeEventListener('mouseenter', handleMouseEnter);
      slider.removeEventListener('mouseleave', handleMouseLeave);
      slider.removeEventListener('touchstart', handleMouseEnter);
      slider.removeEventListener('touchend', handleMouseLeave);
    };
  }, [upcomingMovies]);

  return (
    <div className="mb-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 animate-reveal">
        <div className="space-y-1">
            <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary-red rounded-full animate-pulse shadow-sm shadow-primary-red/50"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Pollywood & Beyond</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                Movie <span className="text-primary-red">Calendar</span>
            </h2>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex gap-2 mr-4">
            <button 
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-400 hover:border-primary-red hover:text-primary-red transition-all"
            >
              <i className="fas fa-chevron-left text-xs"></i>
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-400 hover:border-primary-red hover:text-primary-red transition-all"
            >
              <i className="fas fa-chevron-right text-xs"></i>
            </button>
          </div>
          <Link to="/movies" className="text-primary-red text-xs font-black uppercase hover:underline flex items-center gap-2 tracking-widest">
              View Schedule <i className="fas fa-arrow-right text-[10px]"></i>
          </Link>
        </div>
      </div>

      <div className="relative mb-2 overflow-hidden h-[1px] w-full bg-slate-100 rounded-full">
        <div className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-primary-red to-transparent animate-slide-infinite"></div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-8 hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {upcomingMovies.map((movie, index) => (
          <Link 
            key={movie._id} 
            to={`/movie/${movie._id}`}
            className="min-w-[200px] md:min-w-[240px] group cursor-pointer no-underline animate-slide-up"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="relative aspect-[2/3] rounded-[2rem] overflow-hidden mb-5 shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
              <img 
                src={movie.image} 
                alt={movie.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay with Date */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
              
              <div className="absolute top-5 left-5 bg-white/10 backdrop-blur-md border border-white/20 text-white p-2 rounded-2xl flex flex-col items-center justify-center min-w-[50px]">
                <span className="text-[10px] font-black uppercase tracking-tighter opacity-70">
                    {new Date(movie.releaseDate).toLocaleDateString('en-US', { month: 'short' })}
                </span>
                <span className="text-xl font-black leading-none">
                    {new Date(movie.releaseDate).getDate()}
                </span>
              </div>

              {/* Play Button Icon on Hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 bg-primary-red text-white rounded-full flex items-center justify-center shadow-2xl shadow-primary-red/50 scale-75 group-hover:scale-100 transition-transform duration-500">
                  <i className="fas fa-play ml-1"></i>
                </div>
              </div>
            </div>

            <div className="space-y-1 px-2">
              <h3 className="text-lg font-black text-slate-900 group-hover:text-primary-red transition-colors italic tracking-tighter uppercase leading-tight line-clamp-1">
                {movie.title}
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{movie.genre}</span>
                <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                <span className="text-[10px] font-bold text-primary-red uppercase italic">Coming Soon</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  );
};

export default MovieCalendar;
