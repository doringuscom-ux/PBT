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
    <header className="relative z-[150] bg-white border-b border-slate-100 shadow-sm">
      <div className="page-container flex justify-between items-center py-2 md:py-3 gap-2 md:gap-4 lg:gap-8">
        {/* Logo */}
        <Link to="/" className="no-underline group shrink-0 relative z-30">
          <Logo className="h-8 md:h-12 lg:h-16 w-auto transition-transform duration-500 group-hover:scale-105" />
        </Link>
 
        {/* Desktop Navigation - Centered */}
        <nav className="hidden xl:flex items-center bg-slate-100/50 p-1.5 rounded-full border border-slate-200/50">
          <ul className="flex items-center list-none p-0 m-0">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.name} className="relative">
                  <Link 
                    to={item.path} 
                    className={`flex items-center px-4 lg:px-5 py-2 rounded-full transition-all duration-300 text-[10px] lg:text-[11px] font-black uppercase tracking-widest no-underline relative ${isActive ? 'bg-black text-white shadow-xl shadow-black/20' : 'text-black hover:text-slate-500 hover:bg-slate-50'}`}
                  >
                    {item.name}
                    {item.badge && (
                      <span className="ml-1.5 bg-yellow-400 text-black text-[8px] px-1.5 py-0.5 rounded-full font-black animate-pulse shadow-sm">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
 
        {/* Right Side: Search & User Actions */}
        <div className="flex items-center gap-2 lg:gap-4 ml-auto relative z-30">
          {/* User Auth */}
          {user ? (
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="hidden sm:flex flex-col items-end mr-1">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{user.role}</span>
                <span className="text-xs font-bold text-black leading-tight">{user.username}</span>
              </div>
              <button onClick={logout} className="bg-black text-white px-4 py-1.5 lg:px-5 lg:py-2.5 rounded-full font-black text-[9px] lg:text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all flex items-center gap-2 shadow-lg">
                <i className="fas fa-sign-out-alt"></i> <span className="hidden sm:inline">LOGOUT</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowUserAuth(true)}
              className="bg-black text-white py-1.5 px-4 lg:py-2.5 lg:px-8 rounded-full font-black text-[9px] lg:text-[11px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg"
            >
              Sign In
            </button>
          )}
 
          {/* Mobile Menu Toggle */}
          <button className="xl:hidden w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-black bg-slate-100 rounded-full hover:bg-slate-200 border border-slate-200" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-sm md:text-base`}></i>
          </button>
        </div>
      </div>
 
      {/* Mobile Navigation Overlay - Solid White and Opaque */}
      <nav className={`xl:hidden fixed inset-0 top-[48px] md:top-[60px] lg:top-[80px] bg-white z-[140] transition-transform duration-500 overflow-y-auto ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="page-container py-8 flex flex-col gap-6 bg-white min-h-[calc(100vh-48px)]">
          <ul className="flex flex-col gap-2 list-none p-0 m-0">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.name}>
                  <Link 
                    to={item.path} 
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-between px-6 py-4 rounded-xl text-lg font-black uppercase tracking-widest no-underline transition-all ${isActive ? 'bg-black text-white shadow-xl shadow-black/20' : 'text-black bg-slate-50 hover:bg-slate-100'}`}
                  >
                    {item.name}
                    {item.badge && (
                      <span className="bg-yellow-400 text-black text-[10px] px-2 py-0.5 rounded-full font-black">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
 
          <div className="mt-6 pt-8 border-t border-slate-100 flex flex-col gap-6 bg-white">
             <div className="relative w-full">
              <input
                type="text"
                placeholder="Search..."
                className="w-full py-4 px-6 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-red-600 outline-none transition-all text-sm font-bold placeholder:text-slate-400 text-black"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearch}
              />
              <button onClick={handleSearch} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-600 transition-colors">
                <i className="fas fa-search text-lg"></i>
              </button>
            </div>
            {isAdmin && (
              <Link to="/admin/dashboard" className="flex items-center justify-center gap-2 bg-yellow-400 text-black py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-yellow-400/20 border-b-4 border-yellow-600/30" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                MANAGE DASHBOARD
              </Link>
            )}
          </div>
        </div>
      </nav>
      <UserAuthModal 
        isOpen={showUserAuth} 
        onClose={() => setShowUserAuth(false)} 
        onAuthSuccess={() => setShowUserAuth(false)} 
      />
    </header>
  );
};

export default Header;
