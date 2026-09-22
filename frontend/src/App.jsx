import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';

// Pages
import Home from './pages/Home';
import Browse from './pages/Browse';
import RecipeDetail from './pages/RecipeDetail';
import Kitchen from './pages/Kitchen';
import Planner from './pages/Planner';
import Favourites from './pages/Favourites';
import Stats from './pages/Stats';
import AddEditRecipe from './pages/AddEditRecipe';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminReviews from './pages/admin/AdminReviews';
import AdminRecipes from './pages/admin/AdminRecipes';

// Blocks pages that need login (and optionally the admin role)
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useContext(AuthContext);

  // If AuthContext exposes a `loading` flag, wait for it so a page refresh
  // does not bounce a logged-in user to /login. If it does not, this is skipped.
  if (loading) {
    return <div className="p-10 text-center text-gray-500">Loading...</div>;
  }

  if (!user) return <Navigate to="/login" replace />;
  if (requireAdmin && user.role !== 'admin') return <Navigate to="/" replace />;

  return children;
};

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-creamBg pb-16 md:pb-0">
      <Navbar />

      <main className="grow">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<Browse />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Static recipe routes come before /recipes/:slug */}
          <Route
            path="/recipes/new"
            element={<ProtectedRoute><AddEditRecipe /></ProtectedRoute>}
          />
          <Route
            path="/recipes/edit/:id"
            element={<ProtectedRoute><AddEditRecipe /></ProtectedRoute>}
          />
          <Route path="/recipes/:slug" element={<RecipeDetail />} />

          {/* Logged-in user routes */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/kitchen" element={<ProtectedRoute><Kitchen /></ProtectedRoute>} />
          <Route path="/planner" element={<ProtectedRoute><Planner /></ProtectedRoute>} />
          <Route path="/favourites" element={<ProtectedRoute><Favourites /></ProtectedRoute>} />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>}
          />
          <Route
            path="/admin/reviews"
            element={<ProtectedRoute requireAdmin><AdminReviews /></ProtectedRoute>}
          />
          <Route
            path="/admin/recipes"
            element={<ProtectedRoute requireAdmin><AdminRecipes /></ProtectedRoute>}
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}

export default App;