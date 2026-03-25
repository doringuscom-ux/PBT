import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import FilterBar from '../components/FilterBar';

const MovieList = () => {
  const { movies } = useData();
  const [filter, setFilter] = useState('ALL');

  const industries = ['ALL', ...new Set(movies.map(m => m.industry))];
  
  const releasedMovies = movies.filter(m => {
    if (!m.releaseDate) return true;
    return new Date(m.releaseDate) <= new Date();
  });

  const filteredMovies = filter === 'ALL' 
    ? releasedMovies 
    : releasedMovies.filter(m => m.industry === filter);

  return (
    <div className="bg-text-dark text-white py-24 min-h-screen">
        <div className="page-container">
          <div className="text-center mb-20">
            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter">Box Office</h1>
            <p className="text-text-gray text-xl max-w-2xl mx-auto">Latest Punjabi movies taking over the cinema screens and hearts of fans worldwide.</p>
          </div>

          <FilterBar 
            options={industries} 
            activeFilter={filter} 
            onFilterChange={setFilter} 
            label="Industry" 
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {filteredMovies.map((movie) => (
              <div key={movie._id} className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col items-center p-3 animate-in fade-in slide-in-from-bottom-4">
                <Link to={`/movie/${movie.slug || movie._id}`} className="relative w-full aspect-[2/3] rounded-xl overflow-hidden shadow-md group-hover:shadow-primary-red/20 transition-all border-2 border-white group-hover:border-primary-red">
                  <img src={movie.image} alt={movie.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-primary-red text-white text-[10px] font-black px-2 py-1 rounded shadow-lg uppercase">{movie.industry}</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-between items-center">
                    <span className="bg-white/90 backdrop-blur text-slate-900 text-[9px] font-black px-2 py-1 rounded rotate-[-2deg] uppercase">{movie.year}</span>
                    <span className="bg-yellow-400 text-slate-900 text-[9px] font-black px-2 py-1 rounded rotate-[2deg] shadow-lg">⭐ {movie.rating}</span>
                  </div>
                </Link>
                <div className="w-full pt-4 pb-2 px-1">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter group-hover:text-primary-red transition-colors mb-2 line-clamp-1">{movie.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{movie.genre}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
};

export default MovieList;
