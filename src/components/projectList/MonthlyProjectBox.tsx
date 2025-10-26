import { ProjectBasic } from "@models/Project";
import Project from "./Project";

interface MonthlyProjectBoxProps {
  month: number;
  projects: ProjectBasic[];
  onEdit: (project: ProjectBasic) => void;
}

/**
 * 월별 프로젝트 리스트 컴포넌트입니다.
 */
const MonthlyProjectBox = ({
  month,
  projects,
  onEdit,
}: MonthlyProjectBoxProps) => {
  return (
    <div className="flex flex-col px-5 py-3 border-l-4 border-[#c1c1d8] bg-[#f8f8f8]">
      <h3 className="text-base mb-2 font-medium">{`${month}월`}</h3>
      {projects.map((project) => (
        <Project key={project.id} project={project} onEdit={onEdit} />
      ))}
    </div>
  );
};

export default MonthlyProjectBox;
