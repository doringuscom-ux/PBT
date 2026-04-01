import React from 'react';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';
import ImageModal from '../components/ImageModal';

const TodayNews = () => {
  const { todayNews, news } = useData();
  const [selectedImage, setSelectedImage] = React.useState(null);
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Just Now';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const todayDate = new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  // Solution: If no news in last 3 days, show popular stories from the archive
  const fallbackNews = news.slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="page-container py-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-primary-red text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider animate-pulse">
                {todayNews.length > 0 ? 'Live Updates' : 'Our Archive'}
              </span>
              <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">{todayDate}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-text-dark tracking-tighter uppercase">
              {todayNews.length > 0 ? (
                <>Latest <span className="text-primary-red">Headlines</span></>
              ) : (
                <>Trending <span className="text-primary-red">Stories</span></>
              )}
            </h1>
          </div>
          <p className="text-gray-500 font-medium max-w-md md:text-right">
            {todayNews.length > 0 
              ? "Stay ahead with the most recent developments in the Punjabi film industry, updated in real-time."
              : "No new headlines in the last 72 hours, but here's what everyone is talking about from our archive."}
          </p>
        </div>

        {(todayNews.length > 0 ? todayNews : fallbackNews).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(todayNews.length > 0 ? todayNews : fallbackNews).map((item) => (
              <Link 
                key={item._id} 
                to={`/news/${item._id}`}
                className="group bg-white rounded-[16px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full relative"
              >
                {todayNews.length === 0 && (
                   <div className="absolute top-3 right-3 z-20 bg-slate-900/80 backdrop-blur-md text-white text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border border-white/10">
                     Top Story
                   </div>
                )}
                <div className="relative h-[160px] overflow-hidden cursor-zoom-in group/img" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedImage({ src: item.image, title: item.title }); }}>
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                     <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
                        <i className="fas fa-expand-alt text-base"></i>
                     </div>
                  </div>
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-primary-red text-[8px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest shadow-lg">
                    {item.category}
                  </span>
                </div>
                <div className="px-5 py-4 flex flex-col flex-1">
                  <div className="text-text-gray text-[8px] font-black mb-1 flex items-center gap-2 uppercase tracking-widest opacity-60">
                    <i className="far fa-clock text-yellow-600"></i> {formatDate(item.createdAt)}
                  </div>
                  <h3 className="text-[16px] font-black text-text-dark mb-1 group-hover:text-yellow-600 transition-colors line-clamp-1 leading-[1.2] uppercase tracking-tighter italic">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-[10px] mb-2 line-clamp-2 leading-relaxed flex-1 font-medium">
                    {item.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">{item.author || 'Editor Team'}</span>
                    </div>
                    <span className="text-primary-red font-black text-[8px] uppercase tracking-widest group-hover:translate-x-1 transition-transform flex items-center gap-2">
                      READ DETAILS <i className="fas fa-arrow-right"></i>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300 text-3xl">
              <i className="fas fa-newspaper"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-400 mb-2">The News Desk is Quiet</h2>
            <p className="text-gray-400">We're verifying some big scoops. In the meantime, explore our other sections!</p>
            <div className="flex justify-center gap-4 mt-8">
               <Link to="/movies" className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary-red transition-colors">Browse Movies</Link>
               <Link to="/celebs" className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-colors">Meet Celebs</Link>
            </div>
          </div>
        )}

        <ImageModal 
            isOpen={!!selectedImage} 
            onClose={() => setSelectedImage(null)} 
            imageSrc={selectedImage?.src} 
            altText={selectedImage?.title} 
        />
      </main>
    </div>
  );
};

export default TodayNews;
