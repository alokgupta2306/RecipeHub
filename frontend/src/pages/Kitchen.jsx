import { useState, useEffect } from 'react';
import api from '../utils/api';
import RecipeCard from '../components/RecipeCard';
import { Plus, X, ChefHat } from 'lucide-react';

const Kitchen = () => {
  const [pantry, setPantry] = useState([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch saved pantry on load
  useEffect(() => {
    api.get('/users/me/pantry')
      .then(res => setPantry(res.data))
      .catch(err => console.error("Error fetching pantry:", err));
  }, []);

  const updatePantry = async (updatedPantry) => {
    try {
      const res = await api.put('/users/me/pantry', { pantry: updatedPantry });
      setPantry(res.data);
    } catch (err) {
      console.error("Error updating pantry:", err);
    }
  };

  const addIngredient = (e) => {
    e.preventDefault();
    const item = newIngredient.trim().toLowerCase();
    if (item && !pantry.includes(item)) {
      updatePantry([...pantry, item]);
    }
    setNewIngredient('');
  };

  const removeIngredient = (itemToRemove) => {
    updatePantry(pantry.filter(item => item !== itemToRemove));
  };

  const findMatches = async () => {
    if (pantry.length === 0) return;
    setLoading(true);
    try {
      const res = await api.post('/users/what-can-i-cook');
      setMatches(res.data);
    } catch (err) {
      console.error("Error finding matches:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      
      {/* Sidebar: Manage Ingredients */}
      <div className="w-full md:w-80 flex-shrink-0 bg-cardWhite p-6 rounded-xl border border-borderGray shadow-sm h-fit">
        <h2 className="text-xl font-poppins font-bold mb-4 flex items-center gap-2">
          <ChefHat className="text-primary" /> My Pantry
        </h2>
        
        <form onSubmit={addIngredient} className="flex gap-2 mb-6">
          <input 
            type="text" 
            placeholder="Add ingredient..."
            className="flex-grow px-3 py-2 border border-borderGray rounded-lg focus:border-primary focus:outline-none"
            value={newIngredient}
            onChange={(e) => setNewIngredient(e.target.value)}
          />
          <button type="submit" className="bg-primary hover:bg-primaryHover text-cardWhite p-2 rounded-lg">
            <Plus size={20} />
          </button>
        </form>

        <div className="flex flex-wrap gap-2 mb-6">
          {pantry.map(item => (
            <div key={item} className="bg-creamBg border border-borderGray px-3 py-1.5 rounded-full flex items-center gap-2 text-sm capitalize">
              {item}
              <button onClick={() => removeIngredient(item)} className="text-mutedGray hover:text-errorRed">
                <X size={14} />
              </button>
            </div>
          ))}
          {pantry.length === 0 && <p className="text-sm text-mutedGray">Your pantry is empty.</p>}
        </div>

        <button 
          onClick={findMatches}
          disabled={pantry.length === 0 || loading}
          className="w-full bg-primary hover:bg-primaryHover disabled:bg-mutedGray text-cardWhite font-bold py-3 rounded-lg transition-colors"
        >
          {loading ? 'Finding...' : 'What can I cook?'}
        </button>
      </div>

      {/* Main Grid: Match Results */}
      <div className="flex-grow">
        <h1 className="text-2xl font-poppins font-bold mb-6">Recipe Matches</h1>
        
        {matches.length === 0 && !loading && (
          <div className="text-center py-20 bg-cardWhite border border-borderGray rounded-xl">
            <h3 className="text-lg font-bold mb-2">No matches yet</h3>
            <p className="text-mutedGray">Add ingredients to your pantry and click search.</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {matches.map(recipe => {
            // Determine badge color based on match percentage
            let badgeColor = 'bg-mutedGray text-cardWhite';
            if (recipe.matchPercentage >= 80) badgeColor = 'bg-freshGreen text-cardWhite';
            else if (recipe.matchPercentage >= 40) badgeColor = 'bg-warningAmber text-cardWhite';

            return (
              <div key={recipe._id} className="relative">
                <RecipeCard recipe={recipe} />
                <div className={`absolute -top-3 -right-3 px-3 py-1 rounded-full text-xs font-bold shadow-md z-10 border border-cardWhite ${badgeColor}`}>
                  {Math.round(recipe.matchPercentage)}% Match
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Kitchen;