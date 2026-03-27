import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const HomeVideoMarquee = () => {
    const { videos } = useData();
    const latestVideos = videos?.slice(0, 20) || [];
    const baseUrl = 'http://localhost:5000';

    if (latestVideos.length === 0) return null;

    return (
        <div className="mb-12 overflow-hidden relative">
            <style>
                {`
                @keyframes marqueeScroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(calc(-280px * ${latestVideos.length} - 1rem * ${latestVideos.length})); }
                }
                .animate-marquee {
                    animation: marqueeScroll ${latestVideos.length * 4}s linear infinite;
                    display: flex;
                    width: max-content;
                }
                .marquee-container:hover .animate-marquee {
                    animation-play-state: paused;
                }
                `}
            </style>

            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-primary-red rounded-sm"></span>
                    <h2 className="text-2xl font-black uppercase tracking-tighter italic text-slate-900">
                        Movie Trailers
                    </h2>
                </div>
                <Link to="/videos" className="text-[10px] font-black uppercase tracking-widest text-primary-red hover:text-slate-900 transition-colors flex items-center gap-1 group">
                    View All <i className="fas fa-chevron-right text-[8px] group-hover:translate-x-1 transition-transform"></i>
                </Link>
            </div>

            <div className="marquee-container relative w-full overflow-hidden">
                {/* Gradient Masks for smooth fading edges */}
                <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#f8f9fa] to-transparent z-10 pointer-events-none hidden md:block"></div>
                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#f8f9fa] to-transparent z-10 pointer-events-none hidden md:block"></div>
                
                <div className="animate-marquee gap-4">
                    {/* Double the list to create a seamless loop effect if needed, but the keyframe handles the width. 
                        To be perfectly seamless, we clone the array once. */}
                    {[...latestVideos, ...latestVideos].map((video, idx) => (
                        <Link 
                            key={`${video._id}-${idx}`} 
                            to={`/video/${video._id}`} 
                            className="w-[280px] shrink-0 group relative rounded-2xl overflow-hidden shadow-md block no-underline"
                        >
                            <div className="aspect-video w-full relative">
                                <img 
                                    src={video.image?.startsWith('/uploads/') ? `${baseUrl}${video.image}` : video.image} 
                                    alt={video.title} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                    <div className="w-12 h-12 rounded-full bg-primary-red flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.5)] transform scale-90 group-hover:scale-100 transition-transform">
                                        <i className="fas fa-play text-white ml-0.5"></i>
                                    </div>
                                </div>
                                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[9px] font-black px-2 py-1 rounded backdrop-blur-sm tracking-widest">
                                    <i className="fas fa-play-circle text-primary-red mr-1"></i> PLAY
                                </div>
                            </div>
                            <div className="p-3 bg-white border-t-2 border-primary-red/10 group-hover:border-primary-red transition-colors">
                                <h4 className="text-[11px] font-black uppercase italic tracking-tight text-slate-800 line-clamp-2 leading-snug group-hover:text-primary-red">
                                    {video.title}
                                </h4>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center mt-4 hidden md:block">
                Scroll horizontally to discover — Click View All for full library
            </p>
        </div>
    );
};

export default HomeVideoMarquee;
