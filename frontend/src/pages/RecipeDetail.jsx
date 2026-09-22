import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { Clock, Flame, Star, Heart, Circle } from 'lucide-react';

const RecipeDetail = () => {
  const { slug } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [trends, setTrends] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recipeRes = await api.get(`/recipes/${slug}`);
        const currentRecipe = recipeRes.data;
        setRecipe(currentRecipe);

        const [trendRes, reviewRes] = await Promise.all([
          api.get(`/recipes/${currentRecipe._id}/trend`),
          api.get(`/recipes/${currentRecipe._id}/reviews`)
        ]);

        const formattedTrends = trendRes.data.map(t => ({
          date: new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
          views: t.views
        }));

        setTrends(formattedTrends);
        setReviews(reviewRes.data);
      } catch (err) {
        console.error('Error loading recipe:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const handleToggleFavourite = async () => {
    try {
      await api.post(`/users/me/favourites/${recipe._id}`);
      alert('Recipe saved to Favourites!'); 
    } catch (err) {
      console.error("Error updating favourites", err);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      setReviewError('');
      await api.post(`/recipes/${recipe._id}/reviews`, { rating, comment });
      alert('Review submitted! It will appear here once an admin approves it.');
      setComment('');
      setRating(5);
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) return <div className="text-center py-20 text-mutedGray font-semibold">Loading recipe...</div>;
  if (!recipe) return <div className="text-center py-20 text-errorRed font-bold">Recipe not found.</div>;

  // The local placeholder image
  const placeholderImg = '/placeholder.svg';
  const isVeg = recipe.dietTags?.includes('vegetarian') || recipe.dietTags?.includes('vegan');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-poppins font-bold text-darkText mb-2">{recipe.title}</h1>
            <p className="text-mutedGray capitalize">{recipe.cuisine} • {recipe.difficulty || 'Medium'}</p>
          </div>
          <div className={`w-4 h-4 rounded-full mt-2 ${isVeg ? 'bg-freshGreen' : 'bg-errorRed'}`} title={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}></div>
        </div>

        {/* Feature Image */}
        <div className="relative aspect-[4/3] max-h-[500px] w-full overflow-hidden rounded-xl shadow-sm border border-borderGray mb-6">
          <img 
            src={recipe.image && recipe.image.startsWith('http') ? recipe.image : placeholderImg} 
            alt={recipe.title} 
            onError={(e) => { e.target.src = placeholderImg; }} 
            className="w-full h-full object-cover" 
          />
        </div>

        {/* Info Chips */}
        <div className="flex flex-wrap gap-4 items-center bg-cardWhite p-4 rounded-xl border border-borderGray shadow-sm">
          <div className="flex items-center gap-2 text-darkText font-semibold">
            <Clock className="text-primary" size={20} />
            {recipe.totalTime} mins
          </div>
          <div className="flex items-center gap-2 text-darkText font-semibold border-l border-borderGray pl-4">
            <Flame className="text-primary" size={20} />
            {recipe.nutrition?.calories || 0} kcal
          </div>
          <div className="flex items-center gap-2 text-darkText font-semibold border-l border-borderGray pl-4">
            <Star className="text-warningAmber fill-warningAmber" size={20} />
            {recipe.ratings?.average?.toFixed(1) || '0.0'} ({recipe.ratings?.count || 0} reviews)
          </div>
          
          {user && (
            <button 
              onClick={handleToggleFavourite}
              className="ml-auto flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary font-bold px-4 py-2 rounded-lg transition-colors"
            >
              <Heart size={18} /> Save
            </button>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Ingredients & Steps */}
        <div className="lg:col-span-2 space-y-8">
          
          <section className="bg-cardWhite p-6 rounded-xl border border-borderGray shadow-sm">
            <h2 className="text-2xl font-poppins font-bold mb-4">Ingredients</h2>
            <ul className="space-y-3">
              {recipe.ingredients?.map((ing, idx) => (
                <li key={idx} className="flex items-start gap-3 border-b border-borderGray pb-2 last:border-0">
                  <Circle size={10} className="text-primary mt-1.5 flex-shrink-0 fill-current" />
                  <span className="text-darkText capitalize">{ing.name}</span>
                  <span className="text-mutedGray ml-auto">{ing.quantity} {ing.unit}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-cardWhite p-6 rounded-xl border border-borderGray shadow-sm">
            <h2 className="text-2xl font-poppins font-bold mb-4">Instructions</h2>
            <div className="space-y-6">
              {recipe.steps?.map((step) => (
                <div key={step.stepNo} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary font-bold rounded-full flex items-center justify-center">
                    {step.stepNo}
                  </div>
                  <p className="text-darkText leading-relaxed pt-1">{step.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Reviews Section */}
          <section className="bg-cardWhite p-6 rounded-xl border border-borderGray shadow-sm">
            <h2 className="text-2xl font-poppins font-bold mb-4">Reviews</h2>
            
            {/* Review Submission Form */}
            {user ? (
              <form onSubmit={handleReviewSubmit} className="mb-8 bg-creamBg p-4 rounded-lg border border-borderGray">
                <h3 className="font-semibold mb-3">Leave a Review</h3>
                {reviewError && <div className="text-errorRed text-sm mb-2">{reviewError}</div>}
                <div className="mb-3 flex items-center gap-2">
                  <label className="text-sm font-semibold">Rating:</label>
                  <select 
                    value={rating} 
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="border border-borderGray rounded px-2 py-1 text-sm focus:outline-none focus:border-primary"
                  >
                    <option value={5}>5 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={2}>2 Stars</option>
                    <option value={1}>1 Star</option>
                  </select>
                </div>
                <textarea 
                  required
                  rows="3"
                  placeholder="Share your thoughts on this recipe..."
                  className="w-full border border-borderGray rounded-lg p-3 text-sm focus:outline-none focus:border-primary mb-3 resize-none"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button type="submit" className="bg-primary hover:bg-primaryHover text-cardWhite font-bold px-4 py-2 rounded-lg text-sm transition-colors">
                  Submit Review
                </button>
              </form>
            ) : (
              <p className="text-sm text-mutedGray mb-6 pb-4 border-b border-borderGray">Please log in to leave a review.</p>
            )}

            {/* Render Approved Reviews */}
            {reviews.length === 0 ? (
              <p className="text-mutedGray">No reviews yet. Be the first to try this!</p>
            ) : (
              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review._id} className="border-b border-borderGray pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{review.reviewerName}</span>
                      <div className="flex text-warningAmber">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < review.rating ? 'fill-warningAmber' : 'text-borderGray'} />
                        ))}
                      </div>
                    </div>
                    <p className="text-darkText text-sm">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>

        {/* Right Column: Nutrition & Chart */}
        <div className="space-y-8">
          
          <section className="bg-cardWhite p-6 rounded-xl border border-borderGray shadow-sm">
            <h2 className="text-xl font-poppins font-bold mb-4">Nutrition</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between pb-2 border-b border-borderGray">
                <span className="text-mutedGray">Calories</span>
                <span className="font-semibold">{recipe.nutrition?.calories || 0}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-borderGray">
                <span className="text-mutedGray">Protein</span>
                <span className="font-semibold">{recipe.nutrition?.protein || 0}g</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-borderGray">
                <span className="text-mutedGray">Fat</span>
                <span className="font-semibold">{recipe.nutrition?.fat || 0}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mutedGray">Carbs</span>
                <span className="font-semibold">{recipe.nutrition?.carbs || 0}g</span>
              </div>
            </div>
          </section>

          <section className="bg-cardWhite p-6 rounded-xl border border-borderGray shadow-sm">
            <h2 className="text-xl font-poppins font-bold mb-4">Popularity Trend</h2>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="views" stroke="#F97316" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-mutedGray text-center mt-2">Views over the last 30 days</p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;