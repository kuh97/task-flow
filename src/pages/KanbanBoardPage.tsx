import { useParams } from "react-router-dom";
import { useProjectStore } from "@store/useProjectStore";

const KanbanBoardPage = () => {
  const { id } = useParams<{ id: string }>();
  const projects = useProjectStore((state) => state.projects);
  const project = projects.find((p) => p.id === Number(id));

  if (!project) {
    return <div>프로젝트를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="ml-[300px] p-10">{`<${project.name}> 칸반 보드 페이지`}</div>
  );
};

export default KanbanBoardPage;
