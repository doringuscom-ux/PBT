import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import AnnouncementBar from './components/AnnouncementBar';
import Header from './components/Header';
import Hero from './components/Hero';
import MovieSlider from './components/MovieSlider';
import MovieCalendar from './components/MovieCalendar';
import NewsGrid from './components/NewsGrid';
import CelebGrid from './components/CelebGrid';
import VideoGrid from './components/VideoGrid';
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
  <main className="w-[96%] max-w-[1800px] mx-auto px-2 py-8">
    <div className="flex flex-col lg:flex-row gap-5">
      <div className="lg:w-[78%] xl:w-[80%]">
        <Hero />
        <MovieSlider />
        <MovieCalendar />
        <NewsGrid />
        <CelebGrid />
        <VideoGrid />
      </div>
      
      <aside className="lg:w-[25%] xl:w-[22%] flex flex-col gap-4 sticky top-[220px] self-start">
        <WeatherWidget />
        <MarketWidget />
      </aside>
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
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/actor/:name" element={<ActorDetail />} />
            <Route path="/celebs" element={<CelebList />} />
            <Route path="/celeb/:id" element={<CelebDetail />} />
            <Route path="/videos" element={<VideosList />} />
            <Route path="/video/:id" element={<VideoDetail />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/sports" element={<SportsList />} />
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
