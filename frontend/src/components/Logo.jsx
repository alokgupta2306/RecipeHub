import { Link } from 'react-router-dom';

/**
 * Text-only RecipeHub wordmark.
 * Usage: <Logo /> in Navbar, Footer, or anywhere else.
 * Pass a size class via `className` to scale it (e.g. "text-2xl" in navbar, "text-xl" in footer).
 */
const Logo = ({ className = 'text-2xl' }) => {
  return (
    <Link to="/" className={`font-poppins font-bold ${className} tracking-tight select-none`}>
      <span className="text-darkText">Recipe</span>
      <span className="text-primary">Hub</span>
    </Link>
  );
};

export default Logo;