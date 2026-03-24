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
    { name: 'CELEBS', path: '/celebs' },
    { name: 'NEWS', path: '/news' },
    { name: 'SPORTS', path: '/sports' },
    { name: 'VIDEOS', path: '/videos' }
  ];

  const isAdmin = user?.role === 'admin' || user?.role === 'sub-admin';

  return (
    <header className="bg-white">
      <div className="w-[96%] max-w-[1800px] mx-auto px-5">
        <div className="flex justify-between items-center py-4 flex-wrap md:flex-nowrap gap-4">
          <Link to="/" className="no-underline group shrink-0">
            <Logo className="h-10 md:h-16 w-auto" />
          </Link>

          <div className="flex items-center gap-4 order-3 md:order-2 w-full md:w-auto mt-4 md:mt-0 justify-between md:justify-end">
            <div className="relative group/search">
              <input
                type="text"
                placeholder="Search..."
                className="py-2 px-4 pr-10 border-2 border-slate-100 rounded-xl focus:border-primary-red outline-none transition-all w-[150px] sm:w-[200px] text-xs font-bold"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearch}
              />
              <button onClick={handleSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-red">
                <i className="fas fa-search"></i>
              </button>
            </div>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{user.role}</span>
                  <span className="text-xs font-bold text-slate-900">{user.username}</span>
                </div>
                {isAdmin && (
                  <Link to="/admin/dashboard" className="hidden lg:flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-red transition-all shadow-lg shadow-slate-900/10">
                    <i className="fas fa-grid-2"></i> Manage
                  </Link>
                )}
                <button onClick={logout} className="bg-slate-100 text-slate-600 p-2.5 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all">
                  <i className="fas fa-sign-out-alt"></i> Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowUserAuth(true)}
                className="bg-slate-900 text-white py-2.5 px-6 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-primary-red transition-all shadow-xl shadow-slate-900/10"
              >
                Sign In
              </button>
            )}

            <button className="md:hidden text-2xl text-slate-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>

        <nav className={`${isMenuOpen ? 'block' : 'hidden'} md:block bg-slate-900 -mx-5 md:mx-0 rounded-t-xl overflow-hidden`}>
          <ul className="flex flex-col md:flex-row list-none p-0 m-0">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link 
                  to={item.path} 
                  className={`block text-white no-underline font-black px-6 py-4 hover:bg-white/10 transition-colors text-[11px] uppercase tracking-widest relative ${location.pathname === item.path ? 'bg-primary-red' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    {item.name}
                    {item.badge && (
                      <span className="bg-white text-primary-red text-[8px] px-1.5 py-0.5 rounded-full animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
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
