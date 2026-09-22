const LiveActivity = ({ activities }) => {
  return (
    <div className="bg-cardWhite rounded-xl p-6 shadow-sm border border-borderGray">
      <h3 className="font-poppins font-semibold text-lg mb-4">Live Activity</h3>
      <div className="space-y-4">
        {activities.map(act => (
          <div key={act._id} className="border-b border-borderGray pb-3 last:border-0 text-sm">
            <p className="text-darkText">
              <span className="font-semibold">{act.firstName}</span> from {act.city} <span className="text-primary">{act.action}</span>
            </p>
            {act.recipe && (
              <p className="text-mutedGray truncate mt-1">"{act.recipe.title}"</p>
            )}
          </div>
        ))}
        {activities.length === 0 && <p className="text-sm text-mutedGray">No recent activity.</p>}
      </div>
    </div>
  );
};

export default LiveActivity;