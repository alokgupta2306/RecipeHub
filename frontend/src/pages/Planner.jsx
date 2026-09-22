import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Calendar, Flame, Plus } from 'lucide-react';

const Planner = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nutritionTotals, setNutritionTotals] = useState({});

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get('/mealplans/my');
        setPlans(res.data);
        
        // Fetch nutrition for the most recent plan if it exists
        if (res.data.length > 0) {
          const nutRes = await api.get(`/mealplans/${res.data[0]._id}/nutrition`);
          setNutritionTotals(nutRes.data);
        }
      } catch (err) {
        console.error("Error fetching meal plans:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const createEmptyPlan = async () => {
    try {
      const today = new Date();
      // Snapshot pattern setup[cite: 1]
      const newPlan = {
        weekStart: today,
        days: [
          { mealType: 'Breakfast', title: 'Example Recipe', calories: 350 },
          { mealType: 'Dinner', title: 'Another Example', calories: 600 }
        ]
      };
      const res = await api.post('/mealplans', newPlan);
      setPlans([res.data, ...plans]);
    } catch (err) {
      console.error("Error creating plan:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Calendar className="text-primary" size={32} />
          <h1 className="text-3xl font-poppins font-bold">Meal Planner</h1>
        </div>
        <button 
          onClick={createEmptyPlan}
          className="flex items-center gap-2 bg-primary hover:bg-primaryHover text-cardWhite font-bold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={20} /> New Plan
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-mutedGray font-semibold">Loading your plans...</div>
      ) : plans.length === 0 ? (
        <div className="text-center py-20 bg-cardWhite border border-borderGray rounded-xl">
          <h3 className="text-lg font-bold mb-2">No meal plans yet</h3>
          <p className="text-mutedGray">Create a new plan to start organizing your week.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Planner View */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-poppins font-bold">Week of {new Date(plans[0].weekStart).toLocaleDateString()}</h2>
            <div className="space-y-4">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, idx) => (
                <div key={day} className="bg-cardWhite p-4 rounded-xl border border-borderGray shadow-sm">
                  <h3 className="font-bold text-darkText mb-3">{day}</h3>
                  {/* Mapping snapshot days[cite: 1] */}
                  {plans[0].days.map((meal, mIdx) => (
                    <div key={mIdx} className="flex justify-between items-center text-sm border-t border-borderGray pt-2 mt-2">
                      <span className="font-semibold text-primary">{meal.mealType}</span>
                      <span className="text-mutedGray">{meal.title}</span>
                      <span className="text-darkText font-medium">{meal.calories} kcal</span>
                    </div>
                  ))}
                  {plans[0].days.length === 0 && <p className="text-sm text-mutedGray">No meals planned.</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Nutrition Sidebar */}
          <div className="space-y-6">
            <div className="bg-cardWhite p-6 rounded-xl border border-borderGray shadow-sm sticky top-24">
              <h3 className="text-lg font-poppins font-bold mb-4 flex items-center gap-2">
                <Flame className="text-primary" size={20} /> Weekly Nutrition
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-borderGray">
                  <span className="text-mutedGray font-medium">Total Calories</span>
                  <span className="font-bold text-darkText">{nutritionTotals.totalCalories || 0}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-borderGray">
                  <span className="text-mutedGray font-medium">Protein</span>
                  <span className="font-bold text-darkText">{nutritionTotals.totalProtein || 0}g</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-borderGray">
                  <span className="text-mutedGray font-medium">Carbs</span>
                  <span className="font-bold text-darkText">{nutritionTotals.totalCarbs || 0}g</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Planner;