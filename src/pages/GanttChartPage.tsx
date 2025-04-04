import { useProjectData } from "@/hooks/project/useProjectMutation";
import GanttChart from "@/components/ganttChart/GanttChart";
import Header from "@components/Header";
import { useProjectStore } from "@/store/useProjectStore";

const GanttChartPage = () => {
  const { projectId } = useProjectStore();
  const { data: project } = useProjectData(projectId);

  return (
    <div className="flex flex-col p-5 px-12 border-box h-full">
      <Header title="간트 차트" />
      <GanttChart tasks={project!.tasks} />
    </div>
  );
};

export default GanttChartPage;
