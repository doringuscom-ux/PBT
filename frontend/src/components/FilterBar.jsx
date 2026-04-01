import React from 'react';

const FilterBar = ({ options, activeFilter, onFilterChange, label = "Filter By", theme = "dark" }) => {
  const isLight = theme === 'light';

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 bg-primary-red"></div>
        <span className={`text-[9px] font-black uppercase tracking-[0.2em] italic ${isLight ? 'text-gray-400' : 'text-white'}`}>{label}</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onFilterChange(option)}
            className={`px-6 py-2.5 rounded-sm font-black text-[10px] uppercase tracking-widest transition-all duration-500 border ${
              activeFilter === option
                ? 'bg-primary-red border-primary-red text-white shadow-[0_10px_25px_rgba(211,47,47,0.2)] scale-105'
                : isLight
                  ? 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                  : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20 hover:text-white'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
