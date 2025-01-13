import { Outlet } from "react-router-dom";
import LeftToolPane from "@components/LeftToolPane";
import { useProjectData } from "@hooks/useProjectData";
import LoadingComponent from "@components/common/LoadingComponent";

const Layout = () => {
  const { data: project, isLoading } = useProjectData();

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (!project) {
    return <div>프로젝트를 찾을 수 없습니다.</div>;
  }

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
