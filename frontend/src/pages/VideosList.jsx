import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FilterBar from '../components/FilterBar';
import { useData } from '../context/DataContext';

const VideosList = () => {
    const { videos } = useData();
    const [filter, setFilter] = useState('ALL');
    const baseUrl = 'http://localhost:5000';

    const industries = ['ALL', ...new Set(videos.map(v => v.industry))];
    const filteredVideos = filter === 'ALL' ? videos : videos.filter(v => v.industry === filter);

    return (
        <div className="bg-gray-900 py-20 min-h-screen">
                <div className="page-container">
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-1 bg-red-600"></div>
                            <h1 className="text-white text-5xl font-black italic tracking-tighter uppercase">Movie Trailers</h1>
                        </div>
                    </div>
                    <p className="text-gray-400 mb-10 text-lg font-medium">Watch the latest exclusive movie trailers, official teasers, and first looks from the cinematic universe.</p>
                    
                    <div className="mb-16">
                        <FilterBar 
                            options={industries} 
                            activeFilter={filter} 
                            onFilterChange={setFilter} 
                            label="Industry" 
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredVideos.map((video) => (
                            <Link 
                                key={video._id} 
                                to={`/video/${video._id}`}
                                className="group cursor-pointer no-underline"
                            >
                                <div className="relative aspect-video rounded-3xl overflow-hidden mb-6 shadow-2xl">
                                    <img 
                                        src={video.image.startsWith('/uploads/') ? `${baseUrl}${video.image}` : video.image} 
                                        alt={video.title} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                    />
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                        <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-slate-900 shadow-xl transform transition-all group-hover:scale-125 group-hover:rotate-12">
                                            <i className="fas fa-play text-xl ml-1"></i>
                                        </div>
                                    </div>
                                    <div className="absolute top-4 left-4 bg-yellow-400 text-slate-900 px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest shadow-lg">{video.industry}</div>
                                    <div className="absolute top-4 right-4 bg-black/80 px-3 py-1 rounded text-xs text-white font-bold uppercase tracking-widest">{video.category}</div>
                                    <div className="absolute bottom-4 right-4 bg-black/80 px-3 py-1 rounded text-xs text-white font-bold">{video.time}</div>
                                </div>
                                <h3 className="text-white text-xl font-bold mb-3 group-hover:text-yellow-400 transition-colors uppercase italic tracking-tight">{video.title}</h3>
                                <div className="flex items-center gap-4 text-gray-500 text-sm">
                                    <span><i className="fas fa-eye mr-2 text-yellow-600"></i> {video.views} views</span>
                                    <span>•</span>
                                    <span>Added Recently</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
        </div>
    );
};

export default VideosList;
