import { useProjectData } from "@hooks/useProjectData";

const MembersPage = () => {
  const { data: project } = useProjectData();

  return (
    <div className="ml-[300px] p-10">{`<${project!.name}> 구성원 관리 페이지`}</div>
  );
};

export default MembersPage;
