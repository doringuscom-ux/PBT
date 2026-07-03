import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import Header from './components/Header';
import Hero from './components/Hero';
import HomeVideoMarquee from './components/HomeVideoMarquee';
import MovieSlider from './components/MovieSlider';
import MovieCalendar from './components/MovieCalendar';
import NewsGrid from './components/NewsGrid';
import CelebGrid from './components/CelebGrid';
import Footer from './components/Footer';

// Admin Imports
const AdminLayout = React.lazy(() => import('./layouts/AdminLayout'));
const MainLayout = React.lazy(() => import('./layouts/MainLayout'));
const Dashboard = React.lazy(() => import('./admin/Dashboard'));
const ManageMovies = React.lazy(() => import('./admin/ManageMovies'));
const ManageNews = React.lazy(() => import('./admin/ManageNews'));
const ManageCelebs = React.lazy(() => import('./admin/ManageCelebs'));
const ManageVideos = React.lazy(() => import('./admin/ManageVideos'));
const ManageUsers = React.lazy(() => import('./admin/ManageUsers'));
const ManageComments = React.lazy(() => import('./admin/ManageComments'));
const AdminLogin = React.lazy(() => import('./admin/AdminLogin'));

// Page Imports
const NewsList = React.lazy(() => import('./pages/NewsList'));
const NewsDetail = React.lazy(() => import('./pages/NewsDetail'));
const MovieList = React.lazy(() => import('./pages/MovieList'));
const MovieDetail = React.lazy(() => import('./pages/MovieDetail'));
const ActorDetail = React.lazy(() => import('./pages/ActorDetail'));
const CelebList = React.lazy(() => import('./pages/CelebList'));
const CelebDetail = React.lazy(() => import('./pages/CelebDetail'));
const VideosList = React.lazy(() => import('./pages/VideosList'));
const VideoDetail = React.lazy(() => import('./pages/VideoDetail'));
const TodayNews = React.lazy(() => import('./pages/TodayNews'));
const SearchPage = React.lazy(() => import('./pages/SearchPage'));
const SportsList = React.lazy(() => import('./pages/SportsList'));
const ManageSports = React.lazy(() => import('./admin/ManageSports'));
const SEOManager = React.lazy(() => import('./admin/SEOManager'));
const ManageSubscribers = React.lazy(() => import('./admin/ManageSubscribers'));
const ManageInquiries = React.lazy(() => import('./admin/ManageInquiries'));
const ManageRedirects = React.lazy(() => import('./admin/ManageRedirects'));

const UpcomingList = React.lazy(() => import('./pages/UpcomingList'));
const ManageUpcoming = React.lazy(() => import('./admin/ManageUpcoming'));
const ContactUs = React.lazy(() => import('./pages/ContactUs'));
const AboutUs = React.lazy(() => import('./pages/AboutUs'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const Disclaimer = React.lazy(() => import('./pages/Disclaimer'));
const BoxOffice = React.lazy(() => import('./pages/BoxOffice'));
const SubmitContent = React.lazy(() => import('./pages/SubmitContent'));

import WeatherWidget from './components/WeatherWidget';
import MarketWidget from './components/MarketWidget';
const NotFound = React.lazy(() => import('./components/NotFound'));
import GlobalRedirector from './components/GlobalRedirector';

import { useData } from './context/DataContext';

// Helper for Protected Routes
const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useData();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-black uppercase tracking-widest text-slate-400">Loading Session...</div>;

  const isAdmin = user?.role === 'admin' || user?.role === 'sub-admin';
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
};

// Wrapper to decide between Movie Industry and Movie Detail
const MoviePageWrapper = () => {
  const params = useParams();
  const param = params['*'];
  const { movies } = useData();
  
  const industries = [...new Set((movies || []).map(m => m.industry).filter(Boolean))];
  const matchedIndustry = industries.find(ind => 
    ind.toLowerCase() === param?.toLowerCase() || 
    ind.toLowerCase().trim().replace(/\s+/g, '-') === param?.toLowerCase()
  );

  if (matchedIndustry) {
    const slugified = matchedIndustry.toLowerCase().trim().replace(/\s+/g, '-');
    // Redirect if current param is not already slugified (e.g. /Bollywood -> /bollywood)
    if (param !== slugified) {
      return <Navigate to={`/latest-movies/${slugified}`} replace />;
    }
    return <MovieList />;
  }

  // Check if it's a specific movie and handle auto-redirection based on release date
  const movie = (movies || []).find(m => m.slug === param || m._id === param);
  if (movie) {
    const isReleased = movie.releaseDate && new Date(movie.releaseDate) <= new Date();
    if (!isReleased && movie.releaseDate) {
      // Movie is upcoming, redirect to upcoming URL
      return <Navigate to={`/latest-movies/upcoming/${param}`} replace />;
    }
  }

  return <MovieDetail />;
};

// Wrapper to decide between Upcoming Industry and Movie Detail
const UpcomingPageWrapper = () => {
  const params = useParams();
  const param = params['*'];
  const { movies } = useData();
  
  const industries = [...new Set((movies || []).map(m => m.industry).filter(Boolean))];
  const matchedIndustry = industries.find(ind => 
    ind.toLowerCase() === param?.toLowerCase() || 
    ind.toLowerCase().trim().replace(/\s+/g, '-') === param?.toLowerCase()
  );

  if (matchedIndustry) {
    const slugified = matchedIndustry.toLowerCase().trim().replace(/\s+/g, '-');
    // Redirect if current param is not already slugified
    if (param !== slugified) {
      return <Navigate to={`/latest-movies/upcoming/${slugified}`} replace />;
    }
    return <UpcomingList />;
  }

  // Check if it's a specific movie and handle auto-redirection based on release date
  const movie = (movies || []).find(m => m.slug === param || m._id === param);
  if (movie) {
    const isReleased = movie.releaseDate && new Date(movie.releaseDate) <= new Date();
    if (isReleased) {
      // Movie is released, redirect to latest movies URL
      return <Navigate to={`/latest-movies/${param}`} replace />;
    }
  }

  return <MovieDetail />;
};

const CelebrityPageWrapper = () => {
  const params = useParams();
  const param = params['*'];
  const { celebs } = useData();
  
  const industries = [...new Set((celebs || []).map(c => c.industry).filter(Boolean))];
  const matchedIndustry = industries.find(ind => 
    ind.toLowerCase() === param?.toLowerCase() || 
    ind.toLowerCase().trim().replace(/\s+/g, '-') === param?.toLowerCase()
  );

  if (matchedIndustry) {
    const slugified = matchedIndustry.toLowerCase().trim().replace(/\s+/g, '-');
    // Redirect if current param is not already slugified
    if (param !== slugified) {
      return <Navigate to={`/celebrities/${slugified}`} replace />;
    }
    return <CelebList />;
  }
  return <CelebDetail />;
};

const HomePage = () => (
  <main className="page-container py-2 lg:py-4">
    <h1 className="sr-only">Pbtadka - Latest News, Movies, & Celebrity Updates</h1>

    <div className="space-y-8 lg:space-y-12">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Mobile Widgets - Shown only on small screens at the top */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
          <WeatherWidget />
          <MarketWidget />
        </div>

        <div className="flex-1 lg:w-[68%] xl:w-[70%] min-w-0">
          <Hero />
        </div>

        <aside className="hidden lg:flex lg:w-[32%] xl:w-[30%] flex-col gap-8">
          <div className="flex flex-col gap-4">
            <WeatherWidget />
            <MarketWidget />
          </div>
        </aside>
      </div>

      {/* Full Width Sections Below Hero/Widgets Row */}
      <div className="space-y-12">
        <HomeVideoMarquee />
        <MovieSlider />
        <MovieCalendar />
        <NewsGrid />
        <CelebGrid industry="Bollywood" />
        <CelebGrid industry="Hollywood" />
        <CelebGrid />
      </div>
    </div>
  </main>
);

function App() {
  return (
    <DataProvider>
      <Router>
        <GlobalRedirector>
          <Suspense fallback={<div className="flex h-screen items-center justify-center bg-[#050505] text-white font-bold tracking-widest uppercase">Loading...</div>}>
          <Routes>
            {/* Public Routes with MainLayout */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/latest-news" element={<NewsList />} />
              <Route path="/latest-news/today" element={<TodayNews />} />
              <Route path="/latest-news/*" element={<NewsDetail />} />
              <Route path="/latest-movies" element={<MovieList />} />
              <Route path="/latest-movies/upcoming" element={<UpcomingList />} />
              <Route path="/latest-movies/upcoming/*" element={<UpcomingPageWrapper />} />
              <Route path="/latest-movies/*" element={<MoviePageWrapper />} />
              <Route path="/actor/:name" element={<ActorDetail />} />
              <Route path="/celebrities" element={<CelebList />} />
              <Route path="/celebrities/*" element={<CelebrityPageWrapper />} />
              <Route path="/latest-viral-videos" element={<VideosList />} />
              <Route path="/latest-viral-videos/*" element={<VideoDetail />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/latest-news/sports" element={<SportsList />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/movie-box-office" element={<BoxOffice />} />
              <Route path="/submit-content" element={<SubmitContent />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="movies" element={<ManageMovies />} />
              <Route path="upcoming" element={<ManageUpcoming />} />
              <Route path="news" element={<ManageNews />} />
              <Route path="sports" element={<ManageSports />} />
              <Route path="celebrities" element={<ManageCelebs />} />
              <Route path="videos" element={<ManageVideos />} />
              <Route path="comments" element={<ManageComments />} />
              <Route path="subscribers" element={<ManageSubscribers />} />
              <Route path="whatsapp-leads" element={<ManageInquiries mode="whatsapp" />} />
              <Route path="promotion-leads" element={<ManageInquiries mode="promotions" />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="seo" element={<SEOManager />} />
              <Route path="redirects" element={<ManageRedirects />} />
            </Route>

            <Route path="/admin/login" element={<AdminLogin />} />
          </Routes>
        </Suspense>
        </GlobalRedirector>
      </Router>
    </DataProvider>
  );
}

export default App;
