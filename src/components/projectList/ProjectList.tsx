import Project from "@models/Project";
import ProjectItem from "@components/projectList/ProjectItem";

/**
 * 임시 데이터
 */
const testProjects: Project[] = [
  {
    id: 1,
    name: "방가방가 프로젝트",
    description: "안녕하세요안녕하세요",
    createdAt: "2024-11-03",
    progress: 0,
    members: [],
    tasks: [],
  },
  {
    id: 2,
    name: "하이루 프로젝트",
    description: "안녕하세요안녕하세요",
    createdAt: "2024-10-12",
    progress: 50,
    members: [],
    endDate: "2025-06-03",
    tasks: [],
  },
  {
    id: 2,
    name: "머선 프로젝트",
    description: "안녕하세요안녕하세요",
    createdAt: "2023-01-20",
    progress: 90,
    members: [],
    tasks: [],
  },
];

/**
 * 프로젝트 리스트 컴포넌트입니다.
 */
function ProjectList() {
  return (
    <div className="box-border mt-10">
      {testProjects.map((project) => (
        <ProjectItem key={project.id} project={project} />
      ))}
    </div>
  );
}

export default ProjectList;
