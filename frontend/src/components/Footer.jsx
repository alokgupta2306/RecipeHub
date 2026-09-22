import { Link } from 'react-router-dom';
import { ChefHat, Globe, Mail, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-cardWhite border-t border-borderGray mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 text-primary font-poppins font-bold text-2xl mb-4">
              <ChefHat size={32} />
              RecipeHub
            </Link>
            <p className="text-mutedGray text-sm max-w-md">
              Your ultimate culinary companion. Discover new recipes, manage your kitchen pantry, and plan your weekly meals all in one place.
            </p>
          </div>

          <div>
            <h3 className="font-poppins font-bold text-darkText mb-4">Explore</h3>
            <ul className="space-y-2 text-sm text-mutedGray">
              <li><Link to="/recipes" className="hover:text-primary transition-colors">Browse Recipes</Link></li>
              <li><Link to="/stats" className="hover:text-primary transition-colors">Platform Stats</Link></li>
              <li><Link to="/kitchen" className="hover:text-primary transition-colors">What Can I Cook?</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-poppins font-bold text-darkText mb-4">Connect</h3>
            <div className="flex gap-4 text-mutedGray">
              <a href="#" className="hover:text-primary transition-colors"><Globe size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors"><Mail size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors"><Heart size={20} /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-borderGray mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-mutedGray">
          <p>&copy; {new Date().getFullYear()} RecipeHub. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-primary">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;