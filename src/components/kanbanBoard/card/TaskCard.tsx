import Task from "@models/Task";
import CardHeader from "@components/kanbanBoard/card/CardHeader";
import CardFooter from "@components/kanbanBoard/card/CardFooter";

interface TaskCardProps {
  task: Task;
}

const TaskCard = ({ task }: TaskCardProps) => {
  const handleClickCard = () => {
    console.log("카드 상세");
  };

  return (
    <div
      className="w-[280px] h-[180px] border border-gray-200 rounded-xl bg-white p-3 shadow-[0_4px_12px_rgba(0,0,0,0.1)] cursor-pointer hover:scale-105 transition-transform duration-150 ease-in-out"
      onClick={handleClickCard}
    >
      <CardHeader name={task.name} managers={task.managers} />
      <div className="flex-col h-[80px]">
        <p className="text-sm text-gray-500">{task.description}</p>
      </div>
      <CardFooter startDate={task.startDate} endDate={task.endDate} />
    </div>
  );
};

export default TaskCard;
