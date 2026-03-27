import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import UserAuthModal from './UserAuthModal';
import { useData } from '../context/DataContext';

const Header = () => {
  const { user, logout } = useData();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserAuth, setShowUserAuth] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (searchQuery.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        setSearchQuery('');
        setIsMenuOpen(false);
      }
    }
  };

  const navItems = [
    { name: 'HOME', path: '/' },
    { name: 'LATEST', path: '/today-news', badge: 'NEW' },
    { name: 'MOVIES', path: '/movies' },
    { name: 'UPCOMING', path: '/upcoming' },
    { name: 'CELEBS', path: '/celebs' },
    { name: 'NEWS', path: '/news' },
    { name: 'SPORTS', path: '/sports' },
    { name: 'VIDEOS', path: '/videos' }
  ];

  const isAdmin = user?.role === 'admin' || user?.role === 'sub-admin';

  return (
    <header className="flex flex-col gap-3 md:gap-4 relative z-50">
      <div className="bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] sm:rounded-b-[2rem] relative z-30 pb-1">
        <div className="page-container flex justify-between items-center py-3 md:py-4 gap-4">
          <Link to="/" className="no-underline group shrink-0">
            <Logo className="h-14 md:h-20 w-auto" />
          </Link>

          {/* Desktop Search and User Auth */}
          <div className="hidden md:flex items-center gap-4 md:order-2 w-auto justify-end">
            <div className="relative group/search">
              <input
                type="text"
                placeholder="Search movies, news, celebs..."
                className="py-3 px-6 pr-12 bg-slate-100 border-2 border-slate-200 rounded-full focus:bg-white focus:border-primary-red focus:shadow-[0_0_20px_rgba(239,68,68,0.15)] outline-none transition-all w-[220px] sm:w-[320px] lg:w-[400px] text-xs font-bold text-slate-900 placeholder:text-slate-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearch}
              />
              <button onClick={handleSearch} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary-red transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50">
                <i className="fas fa-search text-sm"></i>
              </button>
            </div>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end mr-1">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{user.role}</span>
                  <span className="text-sm font-bold text-slate-900 leading-tight">{user.username}</span>
                </div>
                {isAdmin && (
                  <Link to="/admin/dashboard" className="hidden lg:flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md">
                    <i className="fas fa-grid-2"></i> MANAGE
                  </Link>
                )}
                <button onClick={logout} className="bg-slate-100 text-slate-700 px-5 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2 shadow-sm">
                  <i className="fas fa-sign-out-alt"></i> LOGOUT
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowUserAuth(true)}
                className="bg-slate-900 text-white py-2.5 px-6 rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button className="md:hidden text-2xl text-slate-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>

      <div className="page-container relative z-20">
        <nav className={`${isMenuOpen ? 'block' : 'hidden'} md:block md:w-fit md:mx-auto bg-gradient-to-r from-slate-900 via-[#1a1f2e] to-slate-900 md:rounded-full rounded-b-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-700/50 transition-all duration-300 relative`}>
          <ul className="flex flex-col md:flex-row list-none p-0 m-0 md:justify-center md:flex-wrap">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.name} className="w-full md:w-auto relative">
                  <Link 
                    to={item.path} 
                    onClick={() => setIsMenuOpen(false)}
                    className={`group/link flex items-center h-full w-full text-white no-underline font-black px-4 md:px-5 lg:px-7 py-3 md:py-3.5 transition-all duration-300 ease-out text-[10px] md:text-[11px] lg:text-xs uppercase tracking-widest relative z-10 overflow-hidden ${isActive ? 'bg-gradient-to-r from-[#e61e25] to-[#cc181f] shadow-[0_0_15px_rgba(230,30,37,0.4)] z-20' : 'hover:bg-white/5 hover:text-red-100'}`}
                  >
                    {/* Hover Animated Bottom Line for Inactive Items */}
                    {!isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ea2e35] to-transparent transform scale-x-0 group-hover/link:scale-x-100 transition-transform duration-500 origin-center opacity-70"></span>
                    )}
                    
                    {/* Active Background Pulse */}
                    {isActive && (
                      <span className="absolute inset-0 bg-white/20 opacity-0 group-hover/link:opacity-100 transition-opacity duration-300"></span>
                    )}

                    <div className="flex items-center gap-2 relative z-30 transform transition-all duration-300 group-hover/link:scale-105 group-hover/link:-translate-y-[1px]">
                      {item.name}
                      {item.badge && (
                        <span className="bg-white text-primary-red text-[8px] px-1.5 py-0.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)] animate-pulse">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Mobile Search and User Auth Container */}
          <div className="md:hidden p-6 border-t border-white/5 flex flex-col gap-5 bg-slate-900/50 backdrop-blur-xl relative z-30">
            <div className="relative group/search w-full">
              <input
                type="text"
                placeholder="Search..."
                className="w-full py-3.5 px-5 pr-12 border-2 border-white/10 bg-slate-800/50 text-white rounded-2xl focus:border-primary-red outline-none transition-all text-sm font-bold placeholder:text-slate-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearch}
              />
              <button onClick={handleSearch} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-red p-2">
                <i className="fas fa-search text-lg"></i>
              </button>
            </div>

            {user ? (
              <div className="flex items-center justify-between gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{user.role}</span>
                  <span className="text-base font-bold text-white tracking-tight">{user.username}</span>
                </div>
                <div className="flex gap-2">
                  {isAdmin && (
                    <Link to="/admin/dashboard" className="flex items-center justify-center w-11 h-11 bg-primary-red text-white rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-primary-red/20" onClick={() => setIsMenuOpen(false)}>
                      <i className="fas fa-grid-2"></i>
                    </Link>
                  )}
                  <button onClick={logout} className="flex items-center justify-center w-11 h-11 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-all border border-white/10">
                    <i className="fas fa-sign-out-alt"></i>
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => { setShowUserAuth(true); setIsMenuOpen(false); }}
                className="bg-primary-red text-white py-4 px-8 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-red-600 transition-all shadow-2xl shadow-primary-red/30 w-full transform active:scale-[0.98]"
              >
                Sign In
              </button>
            )}
          </div>
        </nav>
      </div>

      <UserAuthModal 
        isOpen={showUserAuth} 
        onClose={() => setShowUserAuth(false)} 
        onAuthSuccess={() => setShowUserAuth(false)} 
      />
    </header>
  );
};

export default Header;
