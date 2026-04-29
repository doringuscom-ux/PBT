import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import Header from './components/Header';
import Hero from './components/Hero';
import HomeVideoMarquee from './components/HomeVideoMarquee';
import MovieSlider from './components/MovieSlider';
import MovieCalendar from './components/MovieCalendar';
import NewsGrid from './components/NewsGrid';
import CelebGrid from './components/CelebGrid';
import TopComments from './components/TopComments';
import Footer from './components/Footer';

// Admin Imports
import AdminLayout from './layouts/AdminLayout';
import MainLayout from './layouts/MainLayout';
import Dashboard from './admin/Dashboard';
import ManageMovies from './admin/ManageMovies';
import ManageNews from './admin/ManageNews';
import ManageCelebs from './admin/ManageCelebs';
import ManageVideos from './admin/ManageVideos';
import ManageUsers from './admin/ManageUsers';
import ManageComments from './admin/ManageComments';
import AdminLogin from './admin/AdminLogin';

// Page Imports
import NewsList from './pages/NewsList';
import NewsDetail from './pages/NewsDetail';
import MovieList from './pages/MovieList';
import MovieDetail from './pages/MovieDetail';
import ActorDetail from './pages/ActorDetail';
import CelebList from './pages/CelebList';
import CelebDetail from './pages/CelebDetail';
import VideosList from './pages/VideosList';
import VideoDetail from './pages/VideoDetail';
import TodayNews from './pages/TodayNews';
import SearchPage from './pages/SearchPage';
import SportsList from './pages/SportsList';
import ManageSports from './admin/ManageSports';
import SEOManager from './admin/SEOManager';
import ManageSubscribers from './admin/ManageSubscribers';
import ManageInquiries from './admin/ManageInquiries';
import ManageRedirects from './admin/ManageRedirects';

import UpcomingList from './pages/UpcomingList';
import ManageUpcoming from './admin/ManageUpcoming';
import ContactUs from './pages/ContactUs';
import BoxOffice from './pages/BoxOffice';
import SubmitContent from './pages/SubmitContent';

import WeatherWidget from './components/WeatherWidget';
import MarketWidget from './components/MarketWidget';
import NotFound from './components/NotFound';
import GlobalRedirector from './components/GlobalRedirector';

import { useData } from './context/DataContext';

// Helper for Protected Routes
const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useData();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-black uppercase tracking-widest text-slate-400">Loading Session...</div>;

  const isAdmin = user?.role === 'admin' || user?.role === 'sub-admin';
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
};

// Wrapper to decide between Industry List and Celeb Detail
const CelebrityPageWrapper = () => {
  const params = useParams();
  const param = params['*'];
  const { celebs } = useData();
  
  const industries = [...new Set((celebs || []).map(c => c.industry).filter(Boolean))];
  const isIndustry = industries.some(ind => ind.toLowerCase() === param?.toLowerCase());

  if (isIndustry) {
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
        <TopComments />
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
          <Routes>
            {/* Public Routes with MainLayout */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/latest-news" element={<NewsList />} />
              <Route path="/latest-news/today" element={<TodayNews />} />
              <Route path="/latest-news/*" element={<NewsDetail />} />
              <Route path="/latest-movies" element={<MovieList />} />
              <Route path="/latest-movies/upcoming" element={<UpcomingList />} />
              <Route path="/latest-movies/*" element={<MovieDetail />} />
              <Route path="/latest-movies/upcoming/*" element={<MovieDetail />} />
              <Route path="/actor/:name" element={<ActorDetail />} />
              <Route path="/celebrities" element={<CelebList />} />
              <Route path="/celebrities/*" element={<CelebrityPageWrapper />} />
              <Route path="/latest-viral-videos" element={<VideosList />} />
              <Route path="/latest-viral-videos/*" element={<VideoDetail />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/latest-news/sports" element={<SportsList />} />
              <Route path="/contact-us" element={<ContactUs />} />
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
        </GlobalRedirector>
      </Router>
    </DataProvider>
  );
}

export default App;
