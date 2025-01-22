import { useProjectData } from "@/hooks/project/useProjectMutation";
import GanttChart from "@/components/ganttChart/GanttChart";
import Header from "@components/Header";

const GanttChartPage = () => {
  const { data: project } = useProjectData();

  return (
    <div className="flex flex-col ml-[250px] p-5 px-12 border-box h-full">
      <Header title="간트 차트" />
      <GanttChart tasks={project!.tasks} />
    </div>
  );
};

export default GanttChartPage;
