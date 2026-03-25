import React, { useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const SearchPage = () => {
  const { news, movies, celebs, videos } = useData();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q')?.toLowerCase() || '';

  const results = useMemo(() => {
    if (!query) return { news: [], movies: [], celebs: [], videos: [] };

    return {
      news: news.filter(item => 
        item.title?.toLowerCase().includes(query) || 
        item.excerpt?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query)
      ),
      movies: movies.filter(item => 
        item.title?.toLowerCase().includes(query) || 
        item.genre?.toLowerCase().includes(query) ||
        item.industry?.toLowerCase().includes(query)
      ),
      celebs: celebs.filter(item => 
        item.name?.toLowerCase().includes(query) || 
        item.role?.toLowerCase().includes(query)
      ),
      videos: videos.filter(item => 
        item.title?.toLowerCase().includes(query) || 
        item.category?.toLowerCase().includes(query)
      )
    };
  }, [query, news, movies, celebs, videos]);

  const loading = false; // Data is already in context
  const hasResults = results.news.length > 0 || results.movies.length > 0 || results.celebs.length > 0 || results.videos.length > 0;

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="page-container">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-text-dark uppercase tracking-tight italic">
            Search Results for: <span className="text-primary-red">"{query}"</span>
          </h1>
          {!loading && !hasResults && (
             <div className="mt-12 bg-white rounded-3xl p-20 text-center border border-gray-100 shadow-sm">
                <i className="fas fa-search text-5xl text-gray-200 mb-6"></i>
                <h2 className="text-2xl font-bold text-gray-400">No results found</h2>
                <p className="text-gray-400 mt-2">Try searching with different keywords or check out our latest news.</p>
                <Link to="/news" className="inline-block mt-8 text-primary-red font-bold hover:underline">Explore News</Link>
             </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary-red border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-16">
            {/* News Results */}
            {results.news.length > 0 && (
              <section>
                <h2 className="text-xl font-black text-text-dark mb-6 flex items-center gap-3 border-l-4 border-primary-red pl-4 uppercase tracking-wider">News Updates</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {results.news.map(item => (
                    <Link key={item._id} to={`/news/${item._id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all">
                      <div className="flex p-4 gap-4">
                        <img src={item.image} className="w-24 h-24 object-cover rounded-xl" alt="" />
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-black text-primary-red uppercase tracking-widest">{item.category}</span>
                          <h3 className="font-bold text-sm text-text-dark mt-1 line-clamp-2 group-hover:text-primary-red transition-all">{item.title}</h3>
                          <span className="text-[9px] text-gray-400 font-bold block mt-2 uppercase">{formatDate(item.createdAt || item.date)}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Movies Results */}
            {results.movies.length > 0 && (
              <section>
                <h2 className="text-xl font-black text-text-dark mb-6 flex items-center gap-3 border-l-4 border-accent-gold pl-4 uppercase tracking-wider">Movies</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {results.movies.map(movie => (
                    <Link 
                      key={movie._id} 
                      to={`/movie/${movie.slug || movie._id}`}
                      className="group flex flex-col no-underline text-inherit"
                    >
                      <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 shadow-lg group-hover:scale-95 transition-all">
                        <img src={movie.image} className="w-full h-full object-cover" alt="" />
                        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black text-white">
                          <span className="text-[9px] font-bold">⭐ {movie.rating}</span>
                        </div>
                      </div>
                      <h3 className="font-bold text-xs truncate group-hover:text-primary-red transition-all">{movie.title}</h3>
                    </Link>
                  ))}
                </div>
              </section>
            )}

             {/* Celebs Results */}
             {results.celebs.length > 0 && (
              <section>
                <h2 className="text-xl font-black text-text-dark mb-6 flex items-center gap-3 border-l-4 border-blue-500 pl-4 uppercase tracking-wider">Celebrities</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {results.celebs.map(celeb => (
                    <Link key={celeb._id} to={`/celebrity/${celeb._id}`} className="flex flex-col items-center group text-center">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary-red mb-3 group-hover:scale-110 transition-all shadow-md">
                        <img src={celeb.image} className="w-full h-full object-cover" alt="" />
                      </div>
                      <h3 className="font-bold text-xs line-clamp-1">{celeb.name}</h3>
                      <span className="text-[9px] text-gray-400 font-bold uppercase">{celeb.role}</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Videos Results */}
            {results.videos.length > 0 && (
              <section>
                <h2 className="text-xl font-black text-text-dark mb-6 flex items-center gap-3 border-l-4 border-red-600 pl-4 uppercase tracking-wider">Videos</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {results.videos.map(video => (
                    <Link key={video._id} to={`/video/${video._id}`} className="group">
                      <div className="relative aspect-video rounded-xl overflow-hidden mb-3 shadow-md group-hover:shadow-xl transition-all">
                        <img src={video.image} className="w-full h-full object-cover" alt="" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all">
                           <i className="fas fa-play text-white text-2xl animate-pulse"></i>
                        </div>
                      </div>
                      <h3 className="font-bold text-xs line-clamp-1 group-hover:text-primary-red transition-all">{video.title}</h3>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
