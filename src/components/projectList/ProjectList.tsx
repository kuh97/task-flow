import { Link } from "react-router-dom";
import { useProjectStore } from "@store/useProjectStore";

function ProjectList() {
  const projects = useProjectStore((state) => state.projects);

  return (
    <div className="box-border mt-10">
      {projects.map((project) => (
        <Link
          key={project.id}
          to={`/project/${project.id}/kanban`}
          className="block cursor-pointer p-4 mb-2 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          <h3 className="text-lg font-semibold">{project.name}</h3>
          <p className="text-sm text-gray-600">{project.description}</p>
        </Link>
      ))}
    </div>
  );
}

export default ProjectList;
