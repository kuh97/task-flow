const LoadingComponent = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="mr-2 font-sans">
        여러분의 작업 공간이 준비되고 있어요!&nbsp;
      </div>
      <div className="text-3xl animate-swing">🧹</div>
    </div>
  );
};

export default LoadingComponent;
