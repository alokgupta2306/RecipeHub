import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import RecipeCard from '../components/RecipeCard';
import LiveActivity from '../components/LiveActivity'; // Importing your new modular component
import { Search, ChefHat } from 'lucide-react';

const Home = () => {
  const [topRated, setTopRated] = useState([]);
  const [activities, setActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [topRes, actRes] = await Promise.all([
          api.get('/stats/top-rated'),
          api.get('/activity/recent')
        ]);
        setTopRated(topRes.data);
        setActivities(actRes.data);
      } catch (error) {
        console.error("Error fetching home data:", error);
      }
    };
    fetchHomeData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/recipes?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-primary/10 py-16 px-4 mb-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-poppins font-bold text-darkText mb-6">
            Cook what you have.
          </h1>
          <p className="text-lg text-mutedGray mb-8">
            Discover recipes based on your ingredients, cuisine preferences, and time.
          </p>
          
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <div className="relative grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-mutedGray" size={20} />
              <input 
                type="text" 
                placeholder="Search for recipes..." 
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-borderGray focus:outline-none focus:border-primary shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="bg-primary hover:bg-primaryHover text-cardWhite font-bold py-3 px-8 rounded-lg transition-colors whitespace-nowrap">
              Search
            </button>
          </form>
          
          <div className="mt-6">
            <button onClick={() => navigate('/kitchen')} className="flex items-center gap-2 mx-auto text-primary font-semibold hover:underline bg-cardWhite px-4 py-2 rounded-full border border-primary/20 shadow-sm">
              <ChefHat size={18} />
              What can I cook with my ingredients?
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 flex flex-col lg:flex-row gap-8">
        
        {/* Top Rated Recipes */}
        <div className="grow">
          <h2 className="text-2xl font-poppins font-semibold mb-6 text-darkText">Top Rated Recipes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {topRated.map(recipe => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
            {topRated.length === 0 && <p className="text-mutedGray">Loading top rated recipes...</p>}
          </div>
        </div>

        {/* Live Activity Feed Sidebar */}
        <div className="lg:w-80 shrink-0">
          <LiveActivity activities={activities} />
        </div>

      </div>
    </div>
  );
};

export default Home;