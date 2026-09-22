import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { MessageSquare, Check, X } from 'lucide-react';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await api.get('/admin/reviews');
      setReviews(res.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleReviewAction = async (id, action) => {
    try {
      await api.put(`/admin/reviews/${id}/${action}`);
      fetchReviews(); // Refresh list after action
    } catch (err) {
      console.error(`Error trying to ${action} review:`, err);
      alert(`Failed to ${action} review.`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <MessageSquare className="text-warningAmber" size={32} />
        <h1 className="text-3xl font-poppins font-bold">Review Moderation</h1>
      </div>

      <div className="bg-cardWhite p-6 rounded-xl border border-borderGray shadow-sm">
        {loading ? (
          <p className="text-center py-10 text-mutedGray">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-center py-10 text-mutedGray">No pending reviews to moderate.</p>
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
                  <button onClick={() => handleReviewAction(review._id, 'approve')} className="flex-1 md:flex-none flex justify-center items-center gap-1 bg-freshGreen hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                    <Check size={18} /> Approve
                  </button>
                  <button onClick={() => handleReviewAction(review._id, 'reject')} className="flex-1 md:flex-none flex justify-center items-center gap-1 bg-errorRed hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                    <X size={18} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviews;