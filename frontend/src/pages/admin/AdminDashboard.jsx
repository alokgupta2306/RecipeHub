import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { Shield, Users, Utensils, MessageSquare, Check, X } from 'lucide-react';

const AdminDashboard = () => {
  const [insights, setInsights] = useState({ usersCount: 0, recipesCount: 0, pendingReviews: 0 });
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [insightsRes, reviewsRes] = await Promise.all([
        api.get('/admin/insights'),
        api.get('/admin/reviews')
      ]);
      setInsights(insightsRes.data);
      setReviews(reviewsRes.data);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAction = async (id, action) => {
    try {
      await api.put(`/admin/reviews/${id}/${action}`);
      // Refresh the data to remove the handled review from the list
      fetchDashboardData();
    } catch (err) {
      console.error(`Error trying to ${action} review:`, err);
      alert(`Failed to ${action} review.`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="text-errorRed" size={32} />
        <h1 className="text-3xl font-poppins font-bold">Admin Dashboard</h1>
      </div>

      {loading ? (
        <div className="text-center py-20 text-mutedGray font-semibold">Loading dashboard...</div>
      ) : (
        <div className="space-y-8">
          
          {/* Insights Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Total Users */}
            <div className="bg-cardWhite p-6 rounded-xl border border-borderGray shadow-sm flex items-center gap-4">
              <div className="bg-primary/10 p-4 rounded-full text-primary"><Users size={24} /></div>
              <div>
                <p className="text-mutedGray text-sm font-semibold">Total Users</p>
                <p className="text-2xl font-bold text-darkText">{insights.usersCount}</p>
              </div>
            </div>

            {/* Total Recipes (Clickable Link to Admin Recipes Table) */}
            <Link to="/admin/recipes" className="bg-cardWhite p-6 rounded-xl border border-borderGray shadow-sm flex items-center justify-between gap-4 hover:border-primary transition-colors group">
              <div className="flex items-center gap-4">
                <div className="bg-freshGreen/10 p-4 rounded-full text-freshGreen"><Utensils size={24} /></div>
                <div>
                  <p className="text-mutedGray text-sm font-semibold">Total Recipes</p>
                  <p className="text-2xl font-bold text-darkText">{insights.recipesCount}</p>
                </div>
              </div>
              <span className="text-primary font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">Manage &rarr;</span>
            </Link>

            {/* Pending Reviews */}
            <div className="bg-cardWhite p-6 rounded-xl border border-borderGray shadow-sm flex items-center gap-4">
              <div className="bg-warningAmber/10 p-4 rounded-full text-warningAmber"><MessageSquare size={24} /></div>
              <div>
                <p className="text-mutedGray text-sm font-semibold">Pending Reviews</p>
                <p className="text-2xl font-bold text-darkText">{insights.pendingReviews}</p>
              </div>
            </div>

          </div>

          {/* Pending Reviews Queue */}
          <div className="bg-cardWhite p-6 rounded-xl border border-borderGray shadow-sm">
            <h2 className="text-xl font-poppins font-bold mb-4">Review Moderation Queue</h2>
            
            {reviews.length === 0 ? (
              <p className="text-mutedGray py-4">No pending reviews to moderate.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review._id} className="border border-borderGray rounded-lg p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-darkText">{review.reviewerName}</span>
                        <span className="text-mutedGray text-sm">on</span>
                        <span className="font-semibold text-primary">{review.recipe?.title || 'Unknown Recipe'}</span>
                        <span className="bg-warningAmber/20 text-warningAmber text-xs px-2 py-0.5 rounded-full font-bold ml-2">
                          {review.rating} Stars
                        </span>
                      </div>
                      <p className="text-darkText">{review.comment}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <button 
                        onClick={() => handleReviewAction(review._id, 'approve')}
                        className="flex-1 md:flex-none flex justify-center items-center gap-1 bg-freshGreen hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                      >
                        <Check size={18} /> Approve
                      </button>
                      <button 
                        onClick={() => handleReviewAction(review._id, 'reject')}
                        className="flex-1 md:flex-none flex justify-center items-center gap-1 bg-errorRed hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                      >
                        <X size={18} /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default AdminDashboard;