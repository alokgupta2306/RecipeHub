import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Search, Clock, Flame, Star } from 'lucide-react';
import SkeletonCard from '../components/SkeletonCard';

const Browse = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedDiet, setSelectedDiet] = useState('');

  const cuisines = ['All', 'Indian', 'Italian', 'Mexican', 'Asian', 'American', 'Mediterranean'];
  const diets = ['All', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Keto'];

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (selectedCuisine && selectedCuisine !== 'All') params.append('cuisine', selectedCuisine.toLowerCase());
        if (selectedDiet && selectedDiet !== 'All') params.append('diet', selectedDiet.toLowerCase());

        const res = await api.get(`/recipes?${params.toString()}`);
        setRecipes(res.data.recipes || res.data);
      } catch (err) {
        console.error("Error fetching recipes:", err);
      } finally {
        setLoading(false);
      }
    };

    const delaySearch = setTimeout(() => {
      fetchRecipes();
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchTerm, selectedCuisine, selectedDiet]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-poppins font-bold text-darkText mb-4">Browse Recipes</h1>

        <div className="relative max-w-2xl">
          <input
            type="text"
            placeholder="Search recipes, ingredients, or cuisines..."
            className="w-full pl-12 pr-4 py-3 border border-borderGray rounded-xl focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-3.5 text-mutedGray" size={20} />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 shrink-0 space-y-8">

          {/* Cuisines Filter */}
          <div>
            <h3 className="font-poppins font-bold text-lg mb-3 border-b border-borderGray pb-2">Cuisines</h3>
            <div className="flex flex-wrap md:flex-col gap-2">
              {cuisines.map((cuisine) => (
                <button
                  key={cuisine}
                  onClick={() => setSelectedCuisine(cuisine)}
                  className={`text-left px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    (selectedCuisine === cuisine || (!selectedCuisine && cuisine === 'All'))
                      ? 'bg-primary text-white'
                      : 'bg-creamBg text-darkText hover:bg-borderGray'
                  }`}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>

          {/* Diet Filter */}
          <div>
            <h3 className="font-poppins font-bold text-lg mb-3 border-b border-borderGray pb-2">Dietary</h3>
            <div className="flex flex-wrap md:flex-col gap-2">
              {diets.map((diet) => (
                <button
                  key={diet}
                  onClick={() => setSelectedDiet(diet)}
                  className={`text-left px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    (selectedDiet === diet || (!selectedDiet && diet === 'All'))
                      ? 'bg-freshGreen text-white'
                      : 'bg-creamBg text-darkText hover:bg-borderGray'
                  }`}
                >
                  {diet}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recipe List */}
        <div className="grow">
          {loading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3, 4, 5, 6].map(n => <SkeletonCard key={n} />)}
            </div>
          ) : recipes.length === 0 ? (
            <div className="text-center py-20 bg-cardWhite rounded-xl border border-borderGray shadow-sm">
              <h3 className="text-xl font-bold text-mutedGray">No recipes found.</h3>
              <p className="text-mutedGray mt-2">Try adjusting your filters or search term.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {recipes.map((recipe) => (
                <Link
                  key={recipe._id}
                  to={`/recipes/${recipe.slug}`}
                  className="bg-cardWhite rounded-xl border border-borderGray shadow-sm hover:shadow-md transition-shadow p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-poppins font-bold text-lg text-darkText mb-1 truncate hover:text-primary transition-colors">
                      {recipe.title}
                    </h3>
                    <p className="text-mutedGray text-sm capitalize">{recipe.cuisine}</p>
                  </div>

                  <div className="flex items-center gap-6 text-sm font-medium text-darkText shrink-0">
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
                    {recipe.dietTags?.includes('vegetarian') && (
                      <span className="bg-freshGreen text-white text-xs font-bold px-2 py-1 rounded-full">
                        Veg
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Browse;