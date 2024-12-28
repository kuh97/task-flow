interface BoardHeaderProps {
  title: string;
  taskCount: number;
}

const BoardHeader = ({ title, taskCount }: BoardHeaderProps) => {
  return (
    <div className="flex w-full h-[40px] p-2 box-border items-center border-b border-slate-300">
      <span className="text-[0.8rem] font-semibold text-slate-700">
        {title}
      </span>
      <div className="flex ml-2 justify-center w-[16px] h-[16px] rounded-full bg-indigo-100 text-xs text-indigo-500">
        {taskCount}
      </div>
    </div>
  );
};

export default BoardHeader;
