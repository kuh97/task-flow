import { Status } from "@models/Task";
import Project from "@/models/Project";
import { useProjectStore } from "@/store/useProjectStore";
import BoardHeader from "@components/kanbanBoard/BoardHeader";
import BoardContent from "@components/kanbanBoard/BoardContent";

interface BoardProps {
  taskType: Status;
  project: Project;
}

const titleRecord: Record<Status, string> = {
  ToDo: "작업 예정",
  InProgress: "작업 중",
  Done: "작업 완료",
};

const Board = ({ taskType, project }: BoardProps) => {
  const { updateTask } = useProjectStore();
  const handleUpdateTask = (targetTaskId: number, newStatus: Status) => {
    const targetTask = project.tasks.find((task) => task.id === targetTaskId);
    if (targetTask) {
      const newTask = { ...targetTask, status: newStatus };
      updateTask(targetTask.projectId, targetTask.id, newTask);
    }
  };

  const filteredTask = project.tasks.filter((task) => task.status === taskType);
  return (
    <div className="flex flex-col w-[300px] h-full box-border rounded-lg bg-indigo-100/35 not:first-of-type:ml-6">
      <BoardHeader
        title={titleRecord[taskType]}
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
