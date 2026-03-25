import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import FilterBar from '../components/FilterBar';

const UpcomingList = () => {
  const { movies } = useData();
  const [filter, setFilter] = useState('ALL');

  const industries = ['ALL', ...new Set(movies.map(m => m.industry))];
  
  const upcomingMovies = movies.filter(m => {
    if (!m.releaseDate) return false;
    return new Date(m.releaseDate) > new Date();
  }).sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));

  const filteredMovies = filter === 'ALL' 
    ? upcomingMovies 
    : upcomingMovies.filter(m => m.industry === filter);

  return (
    <div className="bg-text-dark text-white py-24 min-h-screen">
        <div className="page-container">
          <div className="text-center mb-20">
            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter uppercase text-primary-red italic">Upcoming</h1>
            <p className="text-text-gray text-xl max-w-2xl mx-auto">Get ready for the most awaited cinematic experiences hitting the screens soon.</p>
          </div>

          <FilterBar 
            options={industries} 
            activeFilter={filter} 
            onFilterChange={setFilter} 
            label="Industry" 
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {filteredMovies.length > 0 ? filteredMovies.map((movie) => (
              <div key={movie._id} className="relative group animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Link to={`/movie/${movie.slug || movie._id}`} className="block relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white group-hover:border-primary-red transition-all duration-300 transform group-hover:-translate-y-2">
                  <img src={movie.image} alt={movie.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" title={movie.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    <span className="bg-primary-red text-white text-[10px] font-black px-2 py-1 rounded shadow-lg uppercase">{movie.industry}</span>
                    <span className="bg-black/40 backdrop-blur-md text-white text-[9px] font-bold px-2 py-1 rounded border border-white/20 uppercase tracking-widest leading-none">
                        {new Date(movie.releaseDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                </Link>
                <div className="mt-6 text-center">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter group-hover:text-primary-red transition-colors mb-1 truncate px-2">{movie.title}</h3>
                    <div className="flex justify-center items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{movie.genre}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                        <span className="text-[10px] font-black text-primary-red uppercase italic">{movie.performance?.status || 'Upcoming'}</span>
                    </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-20 text-center">
                <i className="fas fa-calendar-times text-gray-200 text-6xl mb-4"></i>
                <p className="text-gray-400 font-bold uppercase tracking-widest italic">No upcoming movies found</p>
              </div>
            )}
          </div>
        </div>
    </div>
  );
};

export default UpcomingList;
