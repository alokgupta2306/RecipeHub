import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../utils/api';
import { BarChart3 } from 'lucide-react';

const Stats = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/stats/calories-by-cuisine');
        // Format the data for Recharts (capitalize cuisine names and round numbers)
        const formattedData = res.data.map(item => ({
          cuisine: item._id ? item._id.charAt(0).toUpperCase() + item._id.slice(1) : 'Other',
          calories: Math.round(item.avgCalories),
          time: Math.round(item.avgTime)
        }));
        setData(formattedData);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <BarChart3 className="text-primary" size={32} />
        <h1 className="text-3xl font-poppins font-bold">Platform Statistics</h1>
      </div>

      {loading ? (
        <div className="text-center py-20 text-mutedGray font-semibold">Loading statistics...</div>
      ) : (
        <div className="bg-cardWhite p-6 rounded-xl border border-borderGray shadow-sm">
          <h2 className="text-xl font-poppins font-bold mb-6">Average Calories & Time by Cuisine</h2>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="cuisine" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" orientation="left" stroke="#F97316" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#16A34A" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#F3F4F6' }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="calories" name="Avg Calories (kcal)" fill="#F97316" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="time" name="Avg Time (mins)" fill="#16A34A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stats;