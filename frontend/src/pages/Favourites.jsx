import { useState, useEffect } from 'react';
import api from '../utils/api';
import RecipeCard from '../components/RecipeCard';
import { Heart } from 'lucide-react';

const Favourites = () => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const res = await api.get('/users/me/favourites');
        setFavourites(res.data);
      } catch (err) {
        console.error("Error fetching favourites:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavourites();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="text-primary fill-primary" size={32} />
        <h1 className="text-3xl font-poppins font-bold">My Favourites</h1>
      </div>

      {loading ? (
        <div className="text-center py-20 text-mutedGray font-semibold">Loading favourites...</div>
      ) : favourites.length === 0 ? (
        <div className="text-center py-20 bg-cardWhite border border-borderGray rounded-xl">
          <h3 className="text-lg font-bold mb-2">No favourites yet</h3>
          <p className="text-mutedGray">Save recipes you love to quickly find them later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {favourites.map(recipe => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favourites;