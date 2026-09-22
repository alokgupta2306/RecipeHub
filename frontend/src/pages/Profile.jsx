import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { User, Plus, X } from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [pantry, setPantry] = useState([]);
  const [newIngredient, setNewIngredient] = useState('');

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
    if (item && !pantry.includes(item)) updatePantry([...pantry, item]);
    setNewIngredient('');
  };

  const removeIngredient = (itemToRemove) => {
    updatePantry(pantry.filter(item => item !== itemToRemove));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-primary/10 p-3 rounded-full text-primary">
          <User size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-poppins font-bold">My Profile</h1>
          <p className="text-mutedGray">Manage your preferences and ingredients</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Account Info */}
        <div className="bg-cardWhite p-6 rounded-xl border border-borderGray shadow-sm h-fit">
          <h2 className="text-xl font-bold mb-4 border-b border-borderGray pb-2">Account Details</h2>
          <div className="space-y-3 text-sm">
            <p><span className="font-semibold text-mutedGray">Name:</span> {user?.name}</p>
            <p><span className="font-semibold text-mutedGray">Email:</span> {user?.email}</p>
            <p><span className="font-semibold text-mutedGray">Role:</span> <span className="capitalize">{user?.role}</span></p>
          </div>
        </div>

        {/* Pantry Manager */}
        <div className="bg-cardWhite p-6 rounded-xl border border-borderGray shadow-sm">
          <h2 className="text-xl font-bold mb-4 border-b border-borderGray pb-2">My Pantry</h2>
          <form onSubmit={addIngredient} className="flex gap-2 mb-4">
            <input 
              type="text" 
              placeholder="Add ingredient..."
              className="flex-grow px-3 py-2 border border-borderGray rounded-lg text-sm focus:border-primary focus:outline-none"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
            />
            <button type="submit" className="bg-primary hover:bg-primaryHover text-cardWhite p-2 rounded-lg"><Plus size={18} /></button>
          </form>

          <div className="flex flex-wrap gap-2">
            {pantry.map(item => (
              <div key={item} className="bg-creamBg border border-borderGray px-3 py-1.5 rounded-full flex items-center gap-2 text-sm capitalize">
                {item}
                <button onClick={() => removeIngredient(item)} className="text-mutedGray hover:text-errorRed"><X size={14} /></button>
              </div>
            ))}
            {pantry.length === 0 && <p className="text-sm text-mutedGray">Your pantry is empty.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;