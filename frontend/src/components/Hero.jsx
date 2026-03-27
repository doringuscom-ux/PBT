import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const Hero = () => {
  const { news } = useData();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Use top 5 stories for the slider, or fewer if less news available
  const sliderStories = news ? news.slice(0, 5) : [];

  useEffect(() => {
    if (sliderStories.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sliderStories.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [sliderStories.length]);

  if (!news || news.length === 0) return null;

  return (
    <div className="mb-8 w-full transition-all">
      
      {/* Expanded Feature Slider (Full width of Hero container) */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 aspect-[16/10] md:aspect-[21/10] lg:h-[500px] w-full group shadow-2xl">
        {sliderStories.map((story, index) => (
          <Link 
            key={story._id}
            to={`/news/${story._id}`} 
            className={`absolute inset-0 transition-all duration-1000 ease-in-out no-underline block
              ${index === currentIndex ? 'opacity-100 visible z-10' : 'opacity-0 invisible z-0'}`}
          >
            <img 
              src={story.image} 
              alt={story.title}
              className={`w-full h-full object-cover opacity-60 transition-transform duration-[5s] ease-linear
                ${index === currentIndex ? 'scale-110' : 'scale-100'}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
            
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-12 text-left">
                <div className={`flex items-center gap-3 mb-4 ${index === currentIndex ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '200ms' }}>
                    <span className="bg-primary-red text-white py-1 px-3 rounded-md text-[10px] font-black uppercase tracking-widest italic shadow-xl shadow-primary-red/20">
                        {story.category}
                    </span>
                    <span className="text-white/40 text-[9px] font-black uppercase tracking-widest">Global Top Story</span>
                </div>
                <h2 className={`text-lg md:text-2xl lg:text-3xl font-black text-white text-shadow-premium group-hover:text-accent-gold transition-colors duration-300 leading-[1.1] mb-4 italic tracking-tighter uppercase ${index === currentIndex ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '400ms' }}>
                    {story.title}
                </h2>
                <p className={`text-xs md:text-base line-clamp-1 max-w-3xl font-medium italic text-white text-shadow-premium ${index === currentIndex ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '600ms' }}>
                    {story.excerpt}
                </p>
                <div className={`mt-8 flex items-center gap-4 ${index === currentIndex ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '800ms' }}>
                    <div className="flex items-center gap-2 bg-white/10 hover:bg-accent-gold group/btn px-4 py-2 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-lg hover:shadow-accent-gold/20">
                        <i className="fas fa-play text-[10px] text-white group-hover/btn:text-slate-900"></i>
                        <span className="text-white group-hover/btn:text-slate-900 text-[10px] font-black uppercase tracking-widest">Read full story</span>
                    </div>
                </div>
            </div>
          </Link>
        ))}

        {/* Slider Indicators */}
        <div className="absolute bottom-8 right-8 z-20 flex gap-2">
            {sliderStories.map((_, i) => (
                <button 
                    key={i}
                    onClick={(e) => {
                        e.preventDefault();
                        setCurrentIndex(i);
                    }}
                    className={`h-1.5 transition-all duration-300 rounded-full ${i === currentIndex ? 'w-8 bg-primary-red' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;

