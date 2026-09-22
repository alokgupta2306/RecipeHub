const SkeletonCard = () => {
  return (
    <div className="bg-cardWhite rounded-xl shadow-sm overflow-hidden flex flex-col border border-borderGray animate-pulse h-[300px]">
      <div className="aspect-[4/3] bg-gray-200 w-full"></div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="flex gap-2 mt-auto">
          <div className="h-5 bg-gray-200 rounded-full w-16"></div>
          <div className="h-5 bg-gray-200 rounded-full w-16"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;