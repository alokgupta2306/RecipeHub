import { Link } from 'react-router-dom';
import { Clock, Flame, Star } from 'lucide-react';

const RecipeCard = ({ recipe }) => {
  if (!recipe) return null;

  return (
    <Link
      to={`/recipes/${recipe.slug}`}
      className="bg-cardWhite rounded-xl border border-borderGray shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-poppins font-bold text-lg text-darkText line-clamp-2 hover:text-primary transition-colors">
          {recipe.title}
        </h3>
        {recipe.dietTags?.includes('vegetarian') && (
          <span className="bg-freshGreen text-white text-xs font-bold px-2 py-1 rounded-full shrink-0">
            Veg
          </span>
        )}
      </div>

      <p className="text-mutedGray text-sm capitalize">{recipe.cuisine}</p>

      <div className="mt-auto flex items-center gap-4 text-sm font-medium text-darkText pt-2 border-t border-borderGray">
        <div className="flex items-center gap-1">
          <Clock size={16} className="text-primary" />
          {recipe.totalTime}m
        </div>
        <div className="flex items-center gap-1">
          <Flame size={16} className="text-primary" />
          {recipe.nutrition?.calories || 0} cal
        </div>
        <div className="flex items-center gap-1">
          <Star size={16} className="text-warningAmber fill-warningAmber" />
          {recipe.ratings?.average?.toFixed(1) || '0.0'}
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;