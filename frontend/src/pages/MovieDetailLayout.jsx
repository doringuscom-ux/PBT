import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CountdownTimer from '../components/CountdownTimer';
import CommentSection from '../components/CommentSection';

const MovieDetailLayout = ({ movie, sidebarNews, movies, onAddComment, onLikeComment, onUpdateComment, onDeleteComment }) => {
    const [activeTab, setActiveTab] = useState('Timeline');
    const [vote, setVote] = useState(null); 
    const [watchScore, setWatchScore] = useState(64);

    const isUpcoming = movie.releaseDate && new Date(movie.releaseDate) > new Date();
    const tabs = ['Timeline', 'Cast & Crew', 'Photos'];

    const handleVote = (type) => {
        if (vote === type) return;
        setVote(type);
        setWatchScore(prev => type === 'watch' ? prev + 1 : prev - 1);
    };

    const getSuggestions = () => {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        
        // Exclude current movie from suggestions
        const otherMovies = movies.filter(m => m._id !== movie._id);
        
        // Tier 1: Movies from the last 30 days
        const freshMovies = otherMovies.filter(m => {
            const date = new Date(m.createdAt || m.releaseDate);
            return date >= oneMonthAgo;
        });

        // Pick up to 6 random fresh movies
        let suggested = [...freshMovies].sort(() => 0.5 - Math.random()).slice(0, 6);
        
        // Tier 2 Fallback: If less than 6 fresh movies, fill with older ones
        if (suggested.length < 6) {
            const olderMovies = otherMovies.filter(m => !freshMovies.some(fm => fm._id === m._id));
            const fillCount = 6 - suggested.length;
            const extra = [...olderMovies].sort(() => 0.5 - Math.random()).slice(0, fillCount);
            suggested = [...suggested, ...extra];
        }
        
        // Final shuffle 
        return suggested.sort(() => 0.5 - Math.random());
    };

    const suggestedMovies = getSuggestions();

    return (
        <div className="bg-[#f8f9fa] min-h-screen">
            {/* Premium Hero Header */}
            <div className="relative h-[400px] md:h-[500px] overflow-hidden">
                {/* Background Image: Cover or Blurred Poster */}
                <div 
                    className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ${movie.coverImage ? 'scale-100 brightness-75' : 'scale-110 blur-xl brightness-50'}`}
                    style={{ backgroundImage: `url(${movie.coverImage || movie.image})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#f8f9fa] via-black/20 to-black/20"></div>

                <div className="page-container relative h-full flex items-end pb-12">
                    <div className="flex flex-col md:flex-row items-end gap-8 w-full">
                        {/* Floating Poster */}
                        <div className="flex flex-col gap-0 group shrink-0">
                            <div className="relative w-44 md:w-56 aspect-[2/3] rounded-sm overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-2 border-white/20 transform -translate-y-4">
                                <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
                                <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/20 cursor-pointer hover:bg-primary-red transition-colors">
                                    <i className="fas fa-plus"></i>
                                </div>
                            </div>

                            {/* Interaction: Voting (Upcoming) or Rating (Released) */}
                            {isUpcoming ? (
                                <div className="bg-white shadow-xl flex items-stretch border-t-4 border-primary-red overflow-hidden transform -translate-y-4">
                                    <div className="bg-primary-red/5 px-4 flex flex-col items-center justify-center border-r border-gray-100">
                                        <span className="text-2xl font-black text-primary-red italic">{watchScore}</span>
                                    </div>
                                    <div className="flex-1 flex flex-col p-2 gap-1 justify-center">
                                        <button 
                                            onClick={() => handleVote('watch')}
                                            className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded transition-all ${vote === 'watch' ? 'bg-green-500 text-white' : 'hover:bg-green-50 text-green-600'}`}
                                        >
                                            <i className="fas fa-check-circle"></i> Will Watch
                                        </button>
                                        <button 
                                            onClick={() => handleVote('not')}
                                            className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded transition-all ${vote === 'not' ? 'bg-red-500 text-white' : 'hover:bg-red-50 text-red-500'}`}
                                        >
                                            <i className="fas fa-times-circle"></i> Not Interested
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white shadow-xl p-3 border-t-4 border-primary-red transform -translate-y-4">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xl font-black text-slate-900 italic transform -skew-x-12">{movie.rating}/10</span>
                                            <div className="flex text-yellow-400 text-[10px]">
                                                {[...Array(5)].map((_, i) => (
                                                    <i key={i} className={`fas fa-star ${i < Math.floor(movie.rating/2) ? 'text-yellow-400' : 'text-gray-200'}`}></i>
                                                ))}
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none bg-gray-50 px-2 py-1.5 rounded-md border border-gray-100">
                                            {movie.likes || 0} User Ratings
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Title & Info */}
                        <div className="flex-1 pb-12">
                            <h1 className="text-4xl md:text-6xl font-black text-white mb-2 drop-shadow-lg tracking-tighter uppercase italic">{movie.title}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-white font-bold uppercase tracking-widest text-[10px] md:text-xs">
                                <span>Release date: {new Date(movie.releaseDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-primary-red"></span>
                                <span className="text-primary-red font-black">{movie.industry}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-primary-red"></span>
                                <span>{movie.genre}</span>
                            </div>
                        </div>

                        {/* Countdown Sidebar (Upcoming Only) */}
                        {isUpcoming && (
                            <div className="hidden lg:block absolute top-12 right-0">
                                <CountdownTimer targetDate={movie.releaseDate} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white border-b sticky top-[64px] md:top-[74px] z-20 shadow-sm overflow-x-auto no-scrollbar">
                <div className="page-container flex">
                    {tabs.map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-4 text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-b-4 ${activeTab === tab ? 'border-primary-red text-primary-red bg-primary-red/5' : 'border-transparent text-gray-500 hover:text-slate-900'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <main className="page-container py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    
                    <div className="lg:w-[70%] xl:w-[75%] space-y-12">
                        {activeTab === 'Timeline' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
                                <section>
                                    <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 mb-6 flex items-center gap-3">
                                        {movie.title} Movie
                                    </h2>
                                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 italic font-medium text-slate-600 leading-relaxed">
                                        <h3 className="text-sm font-black text-primary-red uppercase tracking-widest mb-4 not-italic">Synopsis</h3>
                                        <p>{movie.overview}</p>
                                        {movie.fullStory && (
                                            <div className="mt-8 pt-8 border-t border-gray-100 rich-text-content not-italic text-sm text-slate-700" dangerouslySetInnerHTML={{ __html: movie.fullStory }} />
                                        )}
                                    </div>
                                </section>

                                <section id="photos">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-black uppercase italic text-slate-900">Photos <span className="text-gray-300 ml-1">({movie.photos?.length || 0})</span></h3>
                                        <button onClick={() => setActiveTab('Photos')} className="text-primary-red font-black uppercase text-[10px] tracking-widest group">View All <i className="fas fa-chevron-right ml-1 transition-transform group-hover:translate-x-1"></i></button>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {(movie.photos?.length > 0 ? movie.photos : [movie.image, movie.coverImage || movie.image]).slice(0, 4).map((p, i) => (
                                            <div key={i} className={`rounded-xl overflow-hidden aspect-[16/10] shadow-md border-2 border-white ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                                                <img src={p} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" alt="" />
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <div className="border-gray-100">
                                    <CommentSection 
                                        itemId={movie._id}
                                        comments={movie.comments}
                                        onAdd={onAddComment}
                                        onLike={onLikeComment}
                                        onUpdate={onUpdateComment}
                                        onDelete={onDeleteComment}
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === 'Cast & Crew' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 mb-8">Main Cast & Production Crew</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-8 px-2">
                                {movie.cast?.map((actor, idx) => (
                                    <Link 
                                        key={idx} 
                                        to={actor.celebrity ? `/celeb/${actor.celebrity.slug || actor.celebrity._id || actor.celebrity}` : `/actor/${encodeURIComponent(actor.name)}`} 
                                        className="group flex flex-col items-center gap-3 no-underline"
                                    >
                                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-xl overflow-hidden transition-transform group-hover:scale-110 duration-500 relative">
                                                <img src={actor.image || 'https://res.cloudinary.com/dzvk7womv/image/upload/v1711287600/default_actor.jpg'} className="w-full h-full object-cover" alt="" />
                                                <div className="absolute inset-0 bg-primary-red/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <i className="fas fa-link text-white text-xl"></i>
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-tight group-hover:text-primary-red transition-colors">{actor.name}</h4>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{actor.role || 'Actor'}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'Photos' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 mb-8">Official Movie Photos</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    {(movie.photos?.length > 0 ? movie.photos : [movie.image, movie.coverImage]).filter(p => p).map((p, idx) => (
                                        <div key={idx} className="rounded-2xl overflow-hidden shadow-xl border-4 border-white aspect-[4/3] group">
                                            <img src={p} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <aside className="lg:w-[30%] xl:w-[25%]">
                        <div className="space-y-12 sticky top-[200px]">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 pb-4 border-b">Suggested For You</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {suggestedMovies.map(m => (
                                        <Link key={m._id} to={`/movie/${m.slug || m._id}`} className="group flex flex-col gap-2 no-underline">
                                            <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-md border-2 border-white group-hover:border-primary-red transition-all duration-300 relative">
                                                <img src={m.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                                <div className="absolute bottom-0 inset-x-0 p-1 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="text-[8px] font-black text-white uppercase block text-center truncate">{m.title}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                                <Link to="/movies" className="block w-full text-center mt-8 py-3 rounded-xl border-2 border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-colors">View All Movies</Link>
                            </div>

                            {movie.trailerUrl && (
                                <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl group cursor-pointer bg-black">
                                    <img src={movie.coverImage || movie.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-60" alt="" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <a href={movie.trailerUrl} target="_blank" rel="noopener noreferrer" className="bg-primary-red text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                                            <i className="fas fa-play ml-1"></i>
                                        </a>
                                    </div>
                                    <div className="absolute bottom-8 left-8 right-8">
                                        <h4 className="text-xl font-black text-white uppercase italic leading-tight mb-4">Official Trailer</h4>
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
};

export default MovieDetailLayout;
