import { Status } from "@models/Task";
import Project from "@models/Project";
import BoardHeader from "@components/kanbanBoard/BoardHeader";
import BoardContent from "@components/kanbanBoard/BoardContent";
import { STATUS_TITLES } from "@/constants/taskContants";
import { useTaskMutations } from "@/hooks/task/useTaskMutation";

interface BoardProps {
  taskType: Status;
  project: Project;
}

const Board = ({ taskType, project }: BoardProps) => {
  const { updateTask } = useTaskMutations({
    projectId: project.id,
  });

  const handleUpdateTask = (targetTaskId: string, newStatus: Status) => {
    updateTask({
      id: targetTaskId,
      status: newStatus,
    });
  };

  const filteredTask = project.tasks.filter((task) => task.status === taskType);
  return (
    <div className="flex flex-col w-[300px] h-full box-border rounded-lg bg-indigo-100/35 not:first-of-type:ml-6">
      <BoardHeader
        title={STATUS_TITLES[taskType]}
        taskCount={filteredTask.length}
      />
      <BoardContent
        type={taskType}
        tasks={filteredTask}
        handleUpdateTask={handleUpdateTask}
      />
    </div>
  );
};

export default Board;
