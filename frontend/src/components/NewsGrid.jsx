import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const NewsGrid = () => {
  const { news } = useData();
  return (
    <div className="mb-16">
      <div className="flex items-center gap-3 mb-10">
        <span className="w-12 h-1.5 bg-primary-red rounded-full"></span>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase italic tracking-tighter">
          World Pulse <span className="text-primary-red">Latest</span>
        </h2>
        <Link to="/news" className="ml-auto text-primary-red text-xs font-black uppercase hover:underline flex items-center gap-2">
            View All <i className="fas fa-arrow-right text-[10px]"></i>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {news.slice(0, 6).map((item, index) => (
          <Link to={`/news/${item._id}`} key={item._id} className="group cursor-pointer no-underline text-inherit block">
            <div className="relative aspect-video rounded-3xl overflow-hidden mb-6 shadow-xl border border-slate-100 bg-slate-50">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-primary-red py-1 px-3 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl">
                {item.category}
              </div>
              <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            
            <div className="flex gap-5">
                <span className="text-4xl font-black text-slate-400 group-hover:text-primary-red transition-colors italic leading-none shrink-0">
                    {String(index + 1).padStart(2, '0')}
                </span>
                <div className="p-4 rounded-3xl group-hover:bg-white transition-all">
                    <h3 className="text-xl font-black mb-3 leading-[1.2] text-slate-900 group-hover:text-primary-red transition-colors italic tracking-tighter uppercase line-clamp-3">
                        {item.title}
                    </h3>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <span>{item.date}</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                        <span className="text-primary-red hover:underline underline-offset-4">Full Story <i className="fas fa-chevron-right text-[8px] ml-1"></i></span>
                    </div>
                </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NewsGrid;
