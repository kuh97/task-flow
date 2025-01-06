import { Outlet, useParams } from "react-router-dom";
import LeftToolPane from "@components/LeftToolPane";
import { useQuery } from "@tanstack/react-query";
import { fetchProjectById } from "@api/projectApi";
import Project from "@models/Project";

export interface OutletContext {
  project: Project;
}

const Layout = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["project", id],
    queryFn: () => {
      if (!id) throw new Error("프로젝트 ID가 없습니다.");
      return fetchProjectById(id);
    },
    enabled: !!id,
  });

  if (!data?.getProjectById) {
    return <div>프로젝트를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="relative">
      {data.getProjectById && (
        <div className="w-64 border-r border-gray-200 bg-gray-50">
          <LeftToolPane project={data.getProjectById} />
        </div>
      )}
      <div className={`h-screen ${data.getProjectById ? "ml-[5px]" : ""}`}>
        <Outlet context={{ project: data.getProjectById }} />
      </div>
    </div>
  );
};

export default Layout;
