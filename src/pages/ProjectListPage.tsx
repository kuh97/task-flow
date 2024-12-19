import Header from "@components/sections/Header";
import ProjectList from "@components/projectList/ProjectList";
import { useProjectStore } from "@store/useProjectStore";
import { useNavigate } from "react-router-dom";

function ProjectListPage() {
  const navigate = useNavigate();
  const addProject = useProjectStore((state) => state.addProject);

  const handleCreateProject = () => {
    // 임시 프로젝트 생성
    const newProject = {
      id: Date.now(), // 임시 ID 생성
      name: "새로운 프로젝트",
      description: "프로젝트 설명을 입력하세요",
      createdAt: new Date().toISOString().split("T")[0],
      progress: 0,
      members: [],
      tasks: [],
    };

    // store에 프로젝트 추가
    addProject(newProject);

    // 새로 생성된 프로젝트의 칸반보드로 이동
    navigate(`/project/${newProject.id}/kanban`);
  };

  return (
    <div className="box-border h-screen mx-40 py-10">
      <Header
        title={"프로젝트"}
        buttonLabel={"생성하기"}
        onClick={handleCreateProject}
      />
      <ProjectList />
    </div>
  );
}

export default ProjectListPage;
