
import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import AnnouncementBar from '../components/AnnouncementBar';
import InquiryPopup from '../components/InquiryPopup';
import { useData } from '../context/DataContext';

const MainLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { movies, news, celebs, videos } = useData();

  // Check if any data is loaded from the backend
  const hasData = (movies?.length > 0) || (news?.length > 0) || (celebs?.length > 0) || (videos?.length > 0);

  useEffect(() => {
    if (hasData) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {}
    }
  }, [hasData]);

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
      {hasData && (
        <div className="w-full text-center my-4 overflow-hidden flex justify-center">
          <ins className="adsbygoogle w-full"
               style={{ display: 'block' }}
               data-ad-client="ca-pub-6214614018313479"
               data-ad-slot="9896265377"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        </div>
      )}
      <InquiryPopup />
      <Footer />
    </div>
  );
};

export default MainLayout;
