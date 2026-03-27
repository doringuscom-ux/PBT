import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import FilterBar from '../components/FilterBar';

const CelebList = () => {
  const { celebs } = useData();
  const [filter, setFilter] = useState('ALL');

  const industries = ['ALL', ...new Set(celebs.map(c => c.industry).filter(Boolean))];
  const filteredCelebs = filter === 'ALL' ? celebs : celebs.filter(c => c.industry === filter);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20 relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-yellow-400/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-yellow-400/5 rounded-full blur-[120px] pointer-events-none translate-y-1/3 -translate-x-1/3"></div>

        <div className="page-container relative z-10">
          <div className="flex flex-col items-center md:items-start mb-16 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-1 bg-yellow-400 rounded-full"></div>
                <span className="font-black text-yellow-400 uppercase tracking-[0.4em] text-[10px] md:text-sm">Cinema Stars</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight drop-shadow-2xl text-center md:text-left">
                  Celeb<span className="text-yellow-400">rities</span>
              </h1>
              <p className="text-white/60 text-sm md:text-base max-w-xl font-medium text-center md:text-left">
                  Discover the profiles, milestones, and cinematic journeys of your favorite stars from the industry.
              </p>
          </div>

          <div className="mb-12 bg-white/5 border border-white/10 p-4 md:p-6 rounded-3xl backdrop-blur-md shadow-2xl">
              <FilterBar 
                options={industries} 
                activeFilter={filter} 
                onFilterChange={setFilter} 
                label="Explore Industry" 
              />
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
            {filteredCelebs.map((celeb) => (
              <Link to={`/celeb/${celeb.slug || celeb._id}`} key={celeb._id} className="group relative block rounded-[2rem] overflow-hidden bg-white/5 border border-white/10 shadow-2xl shadow-black/50 hover:shadow-primary-red/20 transition-all duration-500 hover:-translate-y-2">
                <div className="aspect-[3/4] relative">
                  <img src={celeb.image} alt={celeb.name} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                  
                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                  
                  {/* Content Container */}
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-primary-red font-black text-[9px] md:text-[10px] uppercase tracking-widest mb-1.5 drop-shadow-md">{celeb.role}</p>
                    <h3 className="text-lg md:text-2xl font-black text-white group-hover:text-primary-red transition-colors duration-300 drop-shadow-lg leading-tight">{celeb.name}</h3>
                  </div>

                  {/* Badge */}
                  <div className="absolute top-4 right-4 z-10 transition-transform duration-500 group-hover:rotate-3 scale-90 md:scale-100">
                    <span className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 text-white text-[9px] font-black px-3 py-1.5 rounded-full shadow-lg uppercase tracking-widest block">{celeb.industry}</span>
                  </div>
                </div>
              </Link>
            ))}

            {filteredCelebs.length === 0 && (
                <div className="col-span-full py-20 text-center">
                    <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <i className="fas fa-star text-white/20 text-3xl"></i>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">No Celebrities Found</h3>
                    <p className="text-white/50 text-sm">No stars match the selected industry filter.</p>
                </div>
            )}
          </div>
        </div>
    </div>
  );
};

export default CelebList;
