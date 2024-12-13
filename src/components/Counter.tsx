// 예시 코드
import { totalStore } from "../store";

const Counter = () => {
  const totalCount = totalStore((state) => state.totalCount);
  const setTotalCount = totalStore((state) => state.setTotalCount);

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Count: {totalCount}</h1>
      <button
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2 transition duration-300"
        onClick={() => setTotalCount(totalCount + 1)}
      >
        Increase
      </button>
      <button
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mr-2 transition duration-300"
        onClick={() => setTotalCount(totalCount - 1)}
      >
        Decrease
      </button>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        onClick={() => setTotalCount(0)}
      >
        Reset
      </button>
    </div>
  );
};

export default Counter;
