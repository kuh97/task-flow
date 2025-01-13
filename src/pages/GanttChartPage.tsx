import { useOutletContext } from "react-router-dom";
import { OutletContext } from "@components/Layout";

const GanttChartPage = () => {
  const { project } = useOutletContext<OutletContext>();

  return (
    <div className="ml-[300px] p-10">{`<${project.name}> 간트 차트 페이지`}</div>
  );
};

export default GanttChartPage;
