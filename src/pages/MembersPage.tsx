import { useProjectData } from "@/hooks/project/useProjectMutation";
import { useProjectStore } from "@/store/useProjectStore";

const MembersPage = () => {
  const { projectId } = useProjectStore();
  const { data: project } = useProjectData(projectId);

  return (
    <div className="ml-[300px] p-10">{`<${project!.name}> 구성원 관리 페이지`}</div>
  );
};

export default MembersPage;
