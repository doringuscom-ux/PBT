import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import CommentSection from '../components/CommentSection';

const MovieDetail = () => {
    const { id } = useParams();
    const { movies, news, addMovieComment, likeMovieComment, updateMovieComment, deleteMovieComment } = useData();
    
    const movie = movies.find(item => item._id === id);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    const sidebarNews = [...news].sort(() => 0.5 - Math.random()).slice(0, 6);

    if (!movie) return <div className="p-10 text-center font-bold">Movie not found</div>;

    return (
        <div className="bg-white min-h-screen">
            <main className="max-w-[1240px] mx-auto px-5 py-8 mt-4">
                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Main Content (70%) */}
                    <div className="lg:w-[70%] xl:w-[72%] min-w-0">
                        <nav className="mb-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                            <Link to="/" className="hover:text-primary-red">Home</Link> 
                            <span className="mx-2">/</span>
                            <Link to="/movies" className="hover:text-primary-red">Movies</Link> 
                            <span className="mx-2">/</span>
                            <span className="text-slate-900">{movie.genre}</span>
                        </nav>
                        
                        <h1 className="text-3xl md:text-5xl font-black mb-6 leading-[1.1] text-slate-900 italic tracking-tighter uppercase font-article-title">
                            {movie.title}
                        </h1>
                        
                        <div className="flex items-center gap-6 mb-8 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                            <span className="flex items-center gap-2"><i className="fas fa-star text-primary-red"></i> {movie.rating}/10 Rating</span>
                            <span className="flex items-center gap-2"><i className="fas fa-heart text-primary-red"></i> {movie.likes || 0} Likes</span>
                            <span className="flex items-center gap-2"><i className="far fa-calendar-alt text-primary-red"></i> {movie.year}</span>
                            <span className="flex items-center gap-2">Industry: {movie.industry || 'Pollywood'}</span>
                        </div>
                        
                        <div className="rounded-2xl overflow-hidden mb-10 shadow-2xl border border-gray-100">
                            <img src={movie.image} alt={movie.title} className="w-full h-auto" />
                        </div>
                        
                        <div className="max-w-none text-slate-800 leading-relaxed mb-12 font-article-text">
                            <div className="flex items-center gap-2 mb-8">
                                <span className="w-8 h-1 bg-primary-red"></span>
                                <h2 className="text-xl font-black uppercase italic tracking-tighter text-slate-900">Story Overview</h2>
                            </div>
                            <p className="text-xl md:text-2xl font-black mb-8 italic text-slate-500 border-l-4 border-primary-red pl-6 py-2 leading-snug font-article-text">
                                {movie.overview || `Set in the vibrant heart of Punjab, "${movie.title}" tells a story of passion, tradition, and modern aspirations.`}
                            </p>
                            <div 
                                className="space-y-6 font-medium text-lg text-slate-700 font-article-text"
                                style={{ wordBreak: 'normal', overflowWrap: 'break-word', hyphens: 'none' }}
                            >
                                {movie.fullStory ? (
                                    <div 
                                        className="rich-text-content"
                                        dangerouslySetInnerHTML={{ __html: movie.fullStory }} 
                                    />
                                ) : (
                                    <>
                                        <p>
                                            The film follows a group of characters whose lives intertwine in unexpected ways, leading to moments of laughter, tears, and profound realization. Director {movie.director || 'Simerjit Singh'} has once again delivered a masterpiece that resonates with both local and global audiences.
                                        </p>
                                        <p>
                                            The soundtrack, featuring the industry's biggest stars, is already topping charts worldwide. "{movie.title}" is being hailed as the biggest Punjabi cinematic achievement of {movie.year}-{movie.year + 1}.
                                        </p>
                                    </>
                                )}
                                {movie.trailerUrl && (
                                    <div className="mt-8">
                                        <a href={movie.trailerUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-primary-red text-white px-6 py-3 rounded-full font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-xl no-underline">
                                            <i className="fas fa-play"></i> Watch Official Trailer
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Visual Cast Section */}
                        {movie.cast && movie.cast.length > 0 && (
                            <div className="mb-12">
                                <div className="flex items-center gap-2 mb-8">
                                    <span className="w-8 h-1 bg-primary-red"></span>
                                    <h2 className="text-xl font-black uppercase italic tracking-tighter text-slate-900">Movie Cast</h2>
                                </div>
                                <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar px-2">
                                    {movie.cast.map((actor, idx) => (
                                        <Link 
                                            key={idx} 
                                            to={`/actor/${encodeURIComponent(actor.name)}`}
                                            className="flex flex-col items-center gap-3 min-w-[120px] group no-underline"
                                        >
                                            <div className="relative">
                                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-primary-red p-1 group-hover:scale-110 transition-transform duration-500 overflow-hidden shadow-lg">
                                                    <img 
                                                        src={actor.image || 'https://res.cloudinary.com/dzvk7womv/image/upload/v1711287600/default_actor.jpg'} 
                                                        alt={actor.name} 
                                                        className="w-full h-full object-cover rounded-full"
                                                    />
                                                </div>
                                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-primary-red text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full scale-90 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    View Bio
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-xs font-black text-slate-900 uppercase tracking-tighter group-hover:text-primary-red transition-colors">{actor.name}</div>
                                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{actor.role || 'Actor'}</div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Additional Info Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                                <h3 className="font-black italic text-sm text-primary-red uppercase tracking-widest mb-6 border-b pb-4">Cast & Crew</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between border-b border-gray-100 pb-3">
                                        <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Director</span>
                                        <span className="font-black text-slate-900 text-sm italic">{movie.director || 'Simerjit Singh'}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-3">
                                        <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Runtime</span>
                                        <span className="font-black text-slate-900 text-sm italic">{movie.runtime || '2h 35m'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Certification</span>
                                        <span className="font-black text-slate-900 text-sm italic">{movie.certification || 'U/A'}</span>
                                    </div>
                                </div>
                            </div>
                            
                            {(!movie.releaseDate || new Date(movie.releaseDate) <= new Date()) && (
                                <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-sm animate-in fade-in duration-700">
                                    <h3 className="font-black italic text-sm text-primary-red uppercase tracking-widest mb-6 border-b pb-4">Performance</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between border-b border-gray-100 pb-3">
                                            <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Day 1</span>
                                            <span className="font-black text-green-600 text-sm italic">{movie.performance?.day1 || '₹8.4 Crore'}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-100 pb-3">
                                            <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Weekend</span>
                                            <span className="font-black text-green-600 text-sm italic">{movie.performance?.weekend || '₹28 Crore'}</span>
                                        </div>
                                        <div className="flex justify-between text-slate-400">
                                            <span className="text-xs font-black uppercase tracking-widest">Status</span>
                                            <span className="font-black text-slate-900 text-sm italic uppercase tracking-tighter">{movie.performance?.status || 'Blockbuster'}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                            <span className="font-black uppercase tracking-widest text-xs text-slate-400">Share this movie</span>
                            <div className="flex gap-4">
                                <a 
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} 
                                    target="_blank" rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                                >
                                    <i className="fab fa-facebook-f"></i>
                                </a>
                                <a 
                                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${movie.title} on Punjabi Film News!`)}&url=${encodeURIComponent(window.location.href)}`} 
                                    target="_blank" rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                                >
                                    <i className="fab fa-twitter"></i>
                                </a>
                                <a 
                                    href={`https://wa.me/?text=${encodeURIComponent(`Check out ${movie.title} on Punjabi Film News! ${window.location.href}`)}`} 
                                    target="_blank" rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                                >
                                    <i className="fab fa-whatsapp"></i>
                                </a>
                            </div>
                        </div>

                        {/* Comment Section */}
                        <CommentSection 
                            itemId={movie._id}
                            comments={movie.comments}
                            onAdd={addMovieComment}
                            onLike={likeMovieComment}
                            onUpdate={updateMovieComment}
                            onDelete={deleteMovieComment}
                        />

                    </div>

                    {/* Sidebar (Trending News) (30%) */}
                    <aside className="lg:w-[30%] xl:w-[28%]">
                        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sticky top-24">
                            <h3 className="text-sm font-black text-primary-red uppercase tracking-widest mb-8 flex items-center gap-2 italic">
                                <span className="w-2.5 h-2.5 bg-primary-red rounded-full animate-pulse"></span> Trending News
                            </h3>
                            
                            <div className="space-y-8">
                                {sidebarNews.map((item) => (
                                    <Link key={item._id} to={`/news/${item._id}`} className="flex gap-4 group cursor-pointer no-underline">
                                        <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden shadow-sm">
                                            <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" />
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <h4 className="text-[12px] font-black text-slate-800 leading-[1.3] line-clamp-3 group-hover:text-primary-red transition-colors uppercase tracking-tight italic">
                                                {item.title}
                                            </h4>
                                            <span className="text-[9px] text-gray-400 font-bold mt-2 uppercase tracking-tighter">Pollywood Update</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
};

export default MovieDetail;
