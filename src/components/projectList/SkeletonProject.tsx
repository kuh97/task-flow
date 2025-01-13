const SkeletonProject = () => {
  return (
    <div className="w-full mt-6 mb-5">
      <div className="w-1/6 h-6 mb-2 bg-gray-100 rounded-md"></div>
      <div className="flex flex-col px-5 py-3 border-l-4 border-[#c1c1d8] bg-[#f8f8f8]">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="flex h-[76px] p-4 mb-2 bg-white rounded-md shadow-sm
                       animate-shimmer bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%]"
          >
            <div className="w-1/4 h-[40px] bg-gray-200 rounded-md"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonProject;
