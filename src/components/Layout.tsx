import { Outlet, useParams } from "react-router-dom";
import LeftToolPane from "@components/LeftToolPane";
import { useProjectStore } from "@store/useProjectStore";

const Layout = () => {
  const { id } = useParams<{ id: string }>();
  const projects = useProjectStore((state) => state.projects);
  const project = id ? projects.find((p) => p.id === Number(id)) : null;

  return (
    <div className="relative">
      {project && (
        <div className="w-64 border-r border-gray-200 bg-gray-50">
          <LeftToolPane project={project} />
        </div>
      )}
      <div className={`h-screen ${project ? "ml-[5px]" : ""}`}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
