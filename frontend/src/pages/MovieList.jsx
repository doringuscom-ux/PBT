import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import FilterBar from '../components/FilterBar';
import MovieCard from '../components/MovieCard';

const MovieList = () => {
  const { movies } = useData();
  const [filter, setFilter] = useState('ALL');

  const industries = ['ALL', ...new Set(movies.map(m => m.industry))];
  
  const releasedMovies = movies.filter(m => {
    if (!m.releaseDate) return true;
    return new Date(m.releaseDate) <= new Date();
  });

  const filteredMovies = releasedMovies.filter(m => {
    return filter === 'ALL' || m.industry === filter;
  });

  return (
    <div className="bg-[#050505] min-h-screen">
        {/* Dynamic Hero Section */}
        <div className="relative h-auto py-12 md:py-20 flex items-center justify-center overflow-hidden">
            {/* Background Image with Blur */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
                    alt="Cinema Background" 
                    className="w-full h-full object-cover blur-sm brightness-[0.2] scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505]"></div>
            </div>

            <div className="relative z-10 text-center px-4 max-w-4xl animate-slide-up">
                <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="w-8 h-[1px] bg-yellow-400"></div>
                    <span className="text-yellow-400 font-black text-[15px] uppercase tracking-[0.4em] italic">Cinematic Excellence</span>
                    <div className="w-8 h-[1px] bg-yellow-400"></div>
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white mb-3 tracking-tighter leading-none shadow-black drop-shadow-2xl uppercase">
                    GLOBAL <span className="text-yellow-400">CINEMA</span>
                </h1>
                <p className="text-white text-xs md:text-sm font-medium max-w-xl mx-auto leading-relaxed italic">
                    Explore an elite collection of blockbusters and timeless classics from every corner of the world.
                </p>
            </div>
        </div>

        <div className="page-container -mt-10 relative z-20 pb-24">
            {/* Filter Controls */}
            <div className="glass-panel p-4 md:p-6 rounded-[2rem] mb-8">
                <FilterBar 
                    options={industries} 
                    activeFilter={filter} 
                    onFilterChange={setFilter} 
                    label="Industry" 
                />
            </div>
            
            {/* Movie Grid */}
            <div className="flex items-center justify-between mb-8 px-2">
                <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase flex items-center gap-3">
                    <span className="w-8 h-1 bg-primary-red"></span>
                    {filter === 'ALL' ? 'Latest Releases' : `${filter} Collection`}
                </h2>
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{filteredMovies.length} Results Found</span>
            </div>

            {filteredMovies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-10">
                    {filteredMovies.map((movie) => (
                        <MovieCard key={movie._id} movie={movie} />
                    ))}
                </div>
            ) : (
                <div className="glass-panel py-32 rounded-[3rem] text-center border-2 border-dashed border-white/5">
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 text-white/20 text-4xl">
                        <i className="fas fa-film"></i>
                    </div>
                    <h2 className="text-2xl font-black text-white/40 italic uppercase tracking-widest mb-2">No Movies Found</h2>
                    <p className="text-white/30 text-sm font-medium">Try adjusting your filters.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default MovieList;
