import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const SportsList = () => {
  const { news, celebs } = useData();
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Just Now';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const sportsNews = news.filter(item => item.category?.toUpperCase() === 'SPORTS');
  
  // Trending Sports Stars Logic (Last 3 days)
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  const trendingCelebrities = Array.from(new Set(
    news
      .filter(n => new Date(n.createdAt) >= threeDaysAgo && n.category?.toUpperCase() === 'SPORTS')
      .flatMap(n => n.relatedCelebrities || [])
      .filter(c => c && c.industry === 'Sports')
      .map(c => JSON.stringify(c))
  )).map(s => JSON.parse(s));

  // Fallback: Top 6 Following if no trending
  const topFollowingCelebrities = [...celebs]
    .filter(c => c.industry === 'Sports')
    .sort((a,b) => {
        const countA = (a.followers?.length || 0) + (a.bonusFollowers || 0);
        const countB = (b.followers?.length || 0) + (b.bonusFollowers || 0);
        return countB - countA;
    })
    .slice(0, 6);

  const sidebarCelebrities = trendingCelebrities.length > 0 ? trendingCelebrities : topFollowingCelebrities;
  const isTrending = trendingCelebrities.length > 0;

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
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="lg:w-2/3 xl:w-3/4">
              {sportsNews.length === 0 ? (
                <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-200">
                  <i className="fas fa-trophy text-6xl text-gray-200 mb-6"></i>
                  <h2 className="text-2xl font-bold text-gray-400 uppercase tracking-tighter">No Sports Updates Yet</h2>
                  <p className="text-gray-400 mt-2">Checking for the latest match results. Stay tuned!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {sportsNews.map((article) => (
                    <Link to={`/news/${article.slug || article._id}`} key={article._id} className="group flex flex-col bg-white rounded-[16px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                      <div className="relative h-[160px] overflow-hidden">
                        <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute top-3 left-3 bg-slate-900 text-white px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-xl border border-white/10 text-center flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-primary-red rounded-full animate-pulse"></span> {article.category}
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="text-text-gray text-[8px] font-black mb-2 flex items-center gap-2 uppercase tracking-widest opacity-60">
                          <i className="far fa-clock text-yellow-600"></i> {formatDate(article.createdAt || article.date)}
                        </div>
                        <h2 className="text-[16px] font-black text-text-dark mb-2 group-hover:text-yellow-600 transition-colors leading-[1.2] uppercase tracking-tighter italic">
                          {article.title}
                        </h2>
                        <p className="text-text-gray text-[10px] leading-relaxed mb-3 line-clamp-2 font-medium">
                          {article.excerpt}
                        </p>
                        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between font-black text-[8px] uppercase tracking-widest">
                            <span className="text-yellow-600 flex items-center gap-2 group-hover:gap-3 transition-all">
                                VIEW STORY <i className="fas fa-arrow-right"></i>
                            </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar: Trending Sports Stars */}
            <aside className="lg:w-1/3 xl:w-1/4">
                <div className="sticky top-24 space-y-6">
                    <div className="bg-slate-950 rounded-3xl p-6 shadow-2xl relative overflow-hidden border border-white/5">
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                            <i className="fas fa-bolt text-7xl text-yellow-400"></i>
                        </div>

                        <h3 className="text-xs font-black text-yellow-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3 italic text-wrap">
                            <span className={`w-2 h-2 rounded-full ${isTrending ? 'bg-primary-red animate-ping' : 'bg-yellow-400'}`}></span> 
                            {isTrending ? 'Trending Sports Stars' : 'Most Followed Athletes'}
                        </h3>

                        {sidebarCelebrities.length > 0 ? (
                            <div className="space-y-6">
                                {sidebarCelebrities.map((celeb) => (
                                    <Link key={celeb._id} to={`/celeb/${celeb.slug || celeb._id}`} className="group flex items-center gap-4 no-underline bg-white/5 p-3 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                                        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-yellow-400 shadow-lg shrink-0">
                                            <img src={celeb.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-black text-white uppercase italic tracking-tighter truncate group-hover:text-yellow-400 transition-colors">
                                                {celeb.name}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest truncate">
                                                    {celeb.role || 'Athlete'}
                                                </p>
                                                {!isTrending && (
                                                    <span className="text-[8px] font-black text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded italic">
                                                        {( (celeb.followers?.length || 0) + (celeb.bonusFollowers || 0) ).toLocaleString()} Fans
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <i className="fas fa-chevron-right"></i>
                                        </div>
                                    </Link>
                                ))}
                                <p className="text-[8px] font-black text-white/30 text-center uppercase tracking-[0.3em] pt-4 italic">
                                    {isTrending ? 'Updates every 72 hours' : 'Ranked by Fan Followers'}
                                </p>
                            </div>
                        ) : (
                            <div className="py-8 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
                                <i className="fas fa-running text-white/20 text-3xl mb-3"></i>
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-relaxed px-4">
                                    Follow the news to see who's trending today
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>
          </div>
        </div>
    </div>
  );
};

export default SportsList;
