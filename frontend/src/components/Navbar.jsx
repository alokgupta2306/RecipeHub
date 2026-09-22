import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-cardWhite shadow-sm border-b border-borderGray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <Link to="/" className="font-poppins font-bold text-xl tracking-tight select-none">
              <span className="text-darkText">Recipe</span>
              <span className="text-primary">Hub</span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link to="/recipes" className="text-darkText hover:text-primary font-semibold">Browse</Link>
              <Link to="/stats" className="text-darkText hover:text-primary font-semibold">Stats</Link>
              {user && (
                <>
                  <Link to="/kitchen" className="text-darkText hover:text-primary font-semibold">My Kitchen</Link>
                  <Link to="/planner" className="text-darkText hover:text-primary font-semibold">Planner</Link>
                  <Link to="/favourites" className="text-darkText hover:text-primary font-semibold">Favourites</Link>
                  <Link to="/recipes/new" className="text-darkText hover:text-primary font-semibold">Create Recipe</Link>
                </>
              )}
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-errorRed font-bold hover:underline">Admin</Link>
                )}
                <span className="text-mutedGray font-medium hidden sm:block">Hi, {user.name.split(' ')[0]}</span>
                <button onClick={handleLogout} className="text-darkText hover:text-primary flex items-center gap-1">
                  <LogOut size={20} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-darkText hover:text-primary font-semibold">Log in</Link>
                <Link to="/register" className="bg-primary hover:bg-primaryHover text-cardWhite px-4 py-2 rounded-lg font-semibold transition-colors">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;