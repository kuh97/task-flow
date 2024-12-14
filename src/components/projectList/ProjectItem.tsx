import Project from "@models/Project";

/**
 * 프로젝트 아이템 컴포넌트입니다.
 */
function ProjectItem({ project }: { project: Project }) {
  return (
    <div className="p-5 mb-2 bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer transition duration-200">
      <span>{project.name}</span>
      <span>{project.createdAt}</span>
    </div>
  );
}

export default ProjectItem;
