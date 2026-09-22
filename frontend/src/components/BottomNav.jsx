import { Link } from 'react-router-dom';
import { Home, Search, Heart, User } from 'lucide-react';

const BottomNav = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-cardWhite border-t border-borderGray flex justify-around py-3 z-50 pb-safe">
      <Link to="/" className="flex flex-col items-center text-mutedGray hover:text-primary">
        <Home size={20} />
        <span className="text-[10px] font-medium mt-1">Home</span>
      </Link>
      <Link to="/recipes" className="flex flex-col items-center text-mutedGray hover:text-primary">
        <Search size={20} />
        <span className="text-[10px] font-medium mt-1">Browse</span>
      </Link>
      <Link to="/favourites" className="flex flex-col items-center text-mutedGray hover:text-primary">
        <Heart size={20} />
        <span className="text-[10px] font-medium mt-1">Saved</span>
      </Link>
      <Link to="/profile" className="flex flex-col items-center text-mutedGray hover:text-primary">
        <User size={20} />
        <span className="text-[10px] font-medium mt-1">Profile</span>
      </Link>
    </nav>
  );
};

export default BottomNav;