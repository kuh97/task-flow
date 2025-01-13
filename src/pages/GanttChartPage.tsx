import { useProjectData } from "@hooks/useProjectData";

const GanttChartPage = () => {
  const { data: project } = useProjectData();

  return (
    <div className="ml-[300px] p-10">{`<${project!.name}> 간트 차트 페이지`}</div>
  );
};

export default GanttChartPage;
