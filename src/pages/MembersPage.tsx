import { useOutletContext } from "react-router-dom";
import { OutletContext } from "@components/Layout";

const MembersPage = () => {
  const { project } = useOutletContext<OutletContext>();

  return (
    <div className="ml-[300px] p-10">{`<${project.name}> 구성원 관리 페이지`}</div>
  );
};

export default MembersPage;
