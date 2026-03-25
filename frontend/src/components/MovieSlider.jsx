import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const MovieSlider = () => {
  const { movies } = useData();
  const sliderRef = useRef(null);

  // Filter for movies that are already released (past or today) OR have no release date set yet
  const releasedMovies = movies.filter(movie => {
    if (!movie.releaseDate) return true;
    return new Date(movie.releaseDate) <= new Date();
  });

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || releasedMovies.length === 0) return;

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
  }, [releasedMovies]);

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6 pb-2.5 border-b-[3px] border-primary-red">
        <h2 className="text-3xl font-extrabold text-text-dark flex items-center">
          <i className="fas fa-film mr-2.5 text-primary-red"></i> Latest Movies
        </h2>
        <Link to="/movies" className="text-primary-red font-semibold no-underline text-sm hover:underline">
          View All <i className="fas fa-arrow-right ml-1"></i>
        </Link>
      </div>
      
      <div 
        ref={sliderRef}
        className="flex overflow-x-auto gap-5 pb-5 movies-slider"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>
          {`
            .movies-slider::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
        {releasedMovies.map((movie) => (
          <Link to={`/movie/${movie.slug || movie._id}`} key={movie._id} className="min-w-[180px] bg-white rounded-lg overflow-hidden shadow-lg hover:-translate-y-1 transition-transform group no-underline text-inherit">
            <img 
              src={movie.image} 
              alt={movie.title} 
              className="w-full h-[250px] object-cover transition-transform group-hover:scale-105"
            />
            <div className="p-4">
              <div className="font-bold mb-1.5 text-lg truncate group-hover:text-primary-red transition-colors">{movie.title}</div>
              <div className="text-text-gray text-xs flex justify-between">
                <span>{movie.year}</span>
                <span className="text-accent-gold font-bold">⭐ {movie.rating}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MovieSlider;
