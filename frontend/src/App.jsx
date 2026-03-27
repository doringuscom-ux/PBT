import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import AnnouncementBar from './components/AnnouncementBar';
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

import UpcomingList from './pages/UpcomingList';
import ManageUpcoming from './admin/ManageUpcoming';
import ContactUs from './pages/ContactUs';

import WeatherWidget from './components/WeatherWidget';
import MarketWidget from './components/MarketWidget';
import NotFound from './components/NotFound';

import { useData } from './context/DataContext';

// Helper for Protected Routes
const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useData();
  
  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-black uppercase tracking-widest text-slate-400">Loading Session...</div>;
  
  const isAdmin = user?.role === 'admin' || user?.role === 'sub-admin';
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
};

// Helper for landing page
const HomePage = () => (
  <main className="page-container py-4 lg:py-8 space-y-12">
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
      <CelebGrid />
    </div>
  </main>
);

function App() {
  return (
    <DataProvider>
      <Router>
        <Routes>
          {/* Public Routes with MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/news" element={<NewsList />} />
            <Route path="/today-news" element={<TodayNews />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/movies" element={<MovieList />} />
            <Route path="/upcoming" element={<UpcomingList />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/actor/:name" element={<ActorDetail />} />
            <Route path="/celebs" element={<CelebList />} />
            <Route path="/celeb/:id" element={<CelebDetail />} />
            <Route path="/videos" element={<VideosList />} />
            <Route path="/video/:id" element={<VideoDetail />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/sports" element={<SportsList />} />
            <Route path="/contact-us" element={<ContactUs />} />
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
            <Route path="celebs" element={<ManageCelebs />} />
            <Route path="videos" element={<ManageVideos />} />
            <Route path="comments" element={<ManageComments />} />
            <Route path="users" element={<ManageUsers />} />
          </Route>

          <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;
