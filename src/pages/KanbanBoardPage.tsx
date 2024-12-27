import { useParams } from "react-router-dom";
import { useProjectStore } from "@store/useProjectStore";
import { statusNames } from "@/models/Task";
import Board from "@components/kanbanBoard/Board";
import TaskCardDragProvider from "@/context/TaskCardDragContext";
import Header from "@/components/sections/Header";

const KanbanBoardPage = () => {
  const { id } = useParams<{ id: string }>();
  const { projects } = useProjectStore();
  const project = projects.find((p) => p.id === Number(id));

  if (!project) {
    return <div>프로젝트를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="flex flex-col ml-[300px] p-5 border-box h-full">
      <Header
        title="칸반 보드"
        buttonLabel="작업 추가"
        onClick={() => console.log("작업 추가")}
      />
      <TaskCardDragProvider>
        <div className="flex h-full border-box space-x-4 overflow-y-auto mt-6">
          {statusNames.map((status) => (
            <Board key={status} taskType={status} project={project} />
          ))}
        </div>
      </TaskCardDragProvider>
    </div>
  );
};

export default KanbanBoardPage;
