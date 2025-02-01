import { Outlet, useParams } from "react-router-dom";
import LeftToolPane from "@components/LeftToolPane";
import { useProjectData } from "@/hooks/project/useProjectMutation";
import LoadingComponent from "@components/common/LoadingComponent";
import {
  TaskSelectProvider,
  useTaskSelectContext,
} from "@/context/TaskSelectContext";
import RightToolPane from "./RightToolPane";
import Project from "@/models/Project";
import { useProjectStore } from "@/store/useProjectStore";
import { useEffect } from "react";

const Layout = () => {
  const { id } = useParams<{ id: string }>();
  const { projectId, setProjectId } = useProjectStore();

  useEffect(() => {
    if (id && id !== projectId) {
      setProjectId(id);
    }
  }, [id, projectId, setProjectId]);

  const { data: project, isLoading } = useProjectData(id ?? "");

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (!project) {
    return <div>프로젝트를 찾을 수 없습니다.</div>;
  }

  return (
    <TaskSelectProvider>
      <LayoutContent project={project} />
    </TaskSelectProvider>
  );
};

const LayoutContent = ({
  project,
}: {
  project: Project | null | undefined;
}) => {
  const {
    selectedTaskId,
    selectedSubTaskId,
    setSelectedTaskId,
    setSelectedSubTaskId,
  } = useTaskSelectContext();

  const handleOutsideClick = () => {
    setSelectedTaskId(null);
    setSelectedSubTaskId(null);
  };

  const renderRightToolPane = (id: string) => {
    return (
      <>
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out z-40
                      ${selectedTaskId ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          onClick={handleOutsideClick}
        />
        <div
          className={`fixed right-0 top-0 w-[400px] h-full bg-white shadow-lg z-50
                    transform transition-transform duration-300 ease-in-out
                    ${selectedTaskId ? "translate-x-0" : "translate-x-full"}`}
        >
          {selectedSubTaskId ? (
            <RightToolPane projectId={id} isSubTask={true} />
          ) : (
            <RightToolPane projectId={id} />
          )}
        </div>
      </>
    );
  };

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
      {project && renderRightToolPane(project.id)}
    </div>
  );
};

export default Layout;
