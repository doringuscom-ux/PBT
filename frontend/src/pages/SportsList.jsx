import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const SportsList = () => {
  const { news } = useData();
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Just Now';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const sportsNews = news.filter(item => item.category?.toUpperCase() === 'SPORTS');

  return (
    <div className="bg-gray-50 py-12 min-h-screen">
        <div className="page-container">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-slate-900 pb-8">
            <div>
              <span className="bg-primary-red text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block shadow-lg">Live Coverage</span>
              <h1 className="text-5xl md:text-7xl font-black text-text-dark tracking-tighter uppercase italic leading-[0.9]">
                SPORTS <span className="text-primary-red">NEWS</span>
              </h1>
            </div>
            <p className="text-text-gray font-bold max-w-sm md:text-right text-sm uppercase tracking-wide">
              The latest action from Punjab and beyond. Track your favorite teams and athletes.
            </p>
          </div>
          
          {sportsNews.length === 0 ? (
            <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-200">
               <i className="fas fa-trophy text-6xl text-gray-200 mb-6"></i>
               <h2 className="text-2xl font-bold text-gray-400 uppercase tracking-tighter">No Sports Updates Yet</h2>
               <p className="text-gray-400 mt-2">Checking for the latest match results. Stay tuned!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {sportsNews.map((article) => (
                <Link to={`/news/${article._id}`} key={article._id} className="group flex flex-col bg-white rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-gray-100">
                  <div className="relative h-[280px] overflow-hidden">
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute top-6 left-6 bg-slate-900 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl border border-white/20">
                      SPORTS
                    </div>
                  </div>
                  <div className="p-10 flex-1 flex flex-col">
                    <div className="text-text-gray text-[10px] font-black mb-6 flex items-center gap-3 uppercase tracking-widest opacity-60">
                      <i className="far fa-clock text-yellow-600"></i> {formatDate(article.createdAt || article.date)}
                    </div>
                    <h2 className="text-2xl font-black text-text-dark mb-6 group-hover:text-yellow-600 transition-colors leading-[1.1] uppercase tracking-tighter italic">
                      {article.title}
                    </h2>
                    <p className="text-text-gray leading-relaxed mb-8 line-clamp-3 font-medium">
                      {article.excerpt}
                    </p>
                    <div className="mt-auto pt-8 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-yellow-600 font-black text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                        VIEW STORY <i className="fas fa-arrow-right"></i>
                      </span>
                      <i className="fas fa-share-alt text-gray-300 hover:text-yellow-600 cursor-pointer"></i>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
    </div>
  );
};

export default SportsList;
