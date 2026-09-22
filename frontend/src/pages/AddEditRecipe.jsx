import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import { Plus, Trash2, Save } from 'lucide-react';

const AddEditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    cuisine: '',
    difficulty: 'Medium',
    totalTime: 30,
    image: '',
    dietTags: '',
    ingredients: [{ name: '', quantity: '', unit: '' }],
    steps: [{ stepNo: 1, text: '' }],
    nutrition: { calories: 0, protein: 0, fat: 0, carbs: 0 }
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      // If editing, we would fetch the recipe by ID here. 
      // For this implementation, you might need to fetch by slug or pass the ID.
      // Example placeholder logic:
      // api.get(`/recipes/manage/${id}`).then(res => setFormData(res.data));
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Dynamic Array Handlers
  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index][field] = value;
    setFormData(prev => ({ ...prev, ingredients: newIngredients }));
  };

  const addIngredient = () => {
    setFormData(prev => ({ ...prev, ingredients: [...prev.ingredients, { name: '', quantity: '', unit: '' }] }));
  };

  const removeIngredient = (index) => {
    setFormData(prev => ({ ...prev, ingredients: prev.ingredients.filter((_, i) => i !== index) }));
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...formData.steps];
    newSteps[index].text = value;
    setFormData(prev => ({ ...prev, steps: newSteps }));
  };

  const addStep = () => {
    setFormData(prev => ({ ...prev, steps: [...prev.steps, { stepNo: prev.steps.length + 1, text: '' }] }));
  };

  const removeStep = (index) => {
    const newSteps = formData.steps.filter((_, i) => i !== index).map((step, i) => ({ ...step, stepNo: i + 1 }));
    setFormData(prev => ({ ...prev, steps: newSteps }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert comma-separated string to array
      const payload = {
        ...formData,
        dietTags: typeof formData.dietTags === 'string' ? formData.dietTags.split(',').map(t => t.trim()) : formData.dietTags
      };

      if (isEditMode) {
        await api.put(`/recipes/manage/${id}`, payload);
        alert('Recipe updated!');
      } else {
        await api.post('/recipes', payload);
        alert('Recipe created successfully!');
      }
      navigate('/recipes');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-poppins font-bold mb-8">{isEditMode ? 'Edit Recipe' : 'Create New Recipe'}</h1>
      
      {error && <div className="bg-errorRed/10 text-errorRed p-4 rounded-lg mb-6">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-8 bg-cardWhite p-6 rounded-xl border border-borderGray shadow-sm">
        
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-1">Recipe Title</label>
            <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border rounded-lg p-2 focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Cuisine</label>
            <input required type="text" name="cuisine" value={formData.cuisine} onChange={handleChange} className="w-full border rounded-lg p-2 focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Image URL</label>
            <input type="text" name="image" value={formData.image} onChange={handleChange} className="w-full border rounded-lg p-2 focus:border-primary focus:outline-none" />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">Time (mins)</label>
              <input required type="number" name="totalTime" value={formData.totalTime} onChange={handleChange} className="w-full border rounded-lg p-2 focus:border-primary focus:outline-none" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">Difficulty</label>
              <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full border rounded-lg p-2 focus:border-primary focus:outline-none">
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-lg font-semibold">Ingredients</label>
            <button type="button" onClick={addIngredient} className="text-primary flex items-center gap-1 text-sm font-bold"><Plus size={16}/> Add Item</button>
          </div>
          {formData.ingredients.map((ing, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input placeholder="Name (e.g. Tomato)" required value={ing.name} onChange={(e) => handleIngredientChange(index, 'name', e.target.value)} className="flex-2 border rounded-lg p-2 w-full text-sm" />
              <input placeholder="Qty (e.g. 2)" required value={ing.quantity} onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)} className="flex-1 border rounded-lg p-2 w-full text-sm" />
              <input placeholder="Unit (e.g. cups)" value={ing.unit} onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)} className="flex-1 border rounded-lg p-2 w-full text-sm" />
              <button type="button" onClick={() => removeIngredient(index)} className="text-errorRed p-2 hover:bg-errorRed/10 rounded-lg"><Trash2 size={18}/></button>
            </div>
          ))}
        </div>

        {/* Steps */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-lg font-semibold">Instructions</label>
            <button type="button" onClick={addStep} className="text-primary flex items-center gap-1 text-sm font-bold"><Plus size={16}/> Add Step</button>
          </div>
          {formData.steps.map((step, index) => (
            <div key={index} className="flex gap-2 mb-2 items-start">
              <div className="bg-primary/10 text-primary font-bold w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0 mt-1">{step.stepNo}</div>
              <textarea required rows="2" value={step.text} onChange={(e) => handleStepChange(index, e.target.value)} className="w-full border rounded-lg p-2 text-sm focus:border-primary focus:outline-none resize-none" />
              <button type="button" onClick={() => removeStep(index)} className="text-errorRed p-2 hover:bg-errorRed/10 rounded-lg mt-1"><Trash2 size={18}/></button>
            </div>
          ))}
        </div>

        <button type="submit" className="w-full bg-primary hover:bg-primaryHover text-cardWhite font-bold py-3 rounded-lg flex justify-center items-center gap-2">
          <Save size={20} /> {isEditMode ? 'Update Recipe' : 'Save Recipe'}
        </button>
      </form>
    </div>
  );
};

export default AddEditRecipe;