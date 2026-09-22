import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { Edit, Trash2, Plus, Search, Utensils } from 'lucide-react';

const AdminRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchRecipes = async (search = '') => {
    setLoading(true);
    try {
      // Reusing the public search endpoint to get the list
      const res = await api.get(`/recipes?search=${search}&limit=50`); 
      setRecipes(res.data.recipes);
    } catch (err) {
      console.error("Error fetching recipes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRecipes(searchQuery);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this recipe?")) {
      try {
        await api.delete(`/recipes/manage/${id}`);
        setRecipes(recipes.filter(r => r._id !== id));
        alert("Recipe deleted successfully.");
      } catch (err) {
        console.error("Error deleting recipe", err);
        alert(err.response?.data?.message || "Failed to delete recipe.");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Utensils className="text-primary" size={32} />
          <h1 className="text-3xl font-poppins font-bold">Manage Recipes</h1>
        </div>
        <Link 
          to="/recipes/new" 
          className="flex items-center gap-2 bg-primary hover:bg-primaryHover text-cardWhite font-bold px-4 py-2 rounded-lg transition-colors w-fit"
        >
          <Plus size={20} /> Add New Recipe
        </Link>
      </div>

      <div className="bg-cardWhite rounded-xl border border-borderGray shadow-sm overflow-hidden">
        
        {/* Search Bar */}
        <div className="p-4 border-b border-borderGray bg-creamBg/50">
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
            <input 
              type="text" 
              placeholder="Search recipes to manage..." 
              className="flex-grow px-3 py-2 border border-borderGray rounded-lg focus:border-primary focus:outline-none text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="bg-darkText hover:bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
              Search
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-creamBg border-b border-borderGray text-mutedGray">
              <tr>
                <th className="px-6 py-3 font-semibold">Title</th>
                <th className="px-6 py-3 font-semibold">Cuisine</th>
                <th className="px-6 py-3 font-semibold">Difficulty</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="px-6 py-8 text-center text-mutedGray">Loading...</td></tr>
              ) : recipes.length === 0 ? (
                <tr><td colSpan="4" className="px-6 py-8 text-center text-mutedGray">No recipes found.</td></tr>
              ) : (
                recipes.map(recipe => (
                  <tr key={recipe._id} className="border-b border-borderGray hover:bg-creamBg/30">
                    <td className="px-6 py-4 font-medium text-darkText">{recipe.title}</td>
                    <td className="px-6 py-4 capitalize">{recipe.cuisine}</td>
                    <td className="px-6 py-4">{recipe.difficulty || 'Medium'}</td>
                    <td className="px-6 py-4 flex justify-end gap-3">
                      <Link 
                        to={`/recipes/edit/${recipe._id}`} 
                        className="text-primary hover:text-primaryHover flex items-center gap-1 font-medium"
                      >
                        <Edit size={16} /> Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(recipe._id)}
                        className="text-errorRed hover:text-red-700 flex items-center gap-1 font-medium"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminRecipes;