
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import AnnouncementBar from '../components/AnnouncementBar';

const MainLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen">
      <SEOHead />
      <div className="sticky top-0 z-[1000] flex flex-col bg-white shadow-md">
        <Header />
      </div>
      {isHomePage && <AnnouncementBar />}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
