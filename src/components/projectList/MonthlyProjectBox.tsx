import { Link } from "react-router-dom";
import CircularProgress from "@components/projectList/CircularProgress";
import Project from "@models/Project";

interface MonthlyProjectBoxProps {
  month: number;
  projects: Project[];
}

const MonthlyProjectBox = ({ month, projects }: MonthlyProjectBoxProps) => {
  return (
    <div className="flex flex-col px-5 py-3 border-l-4 border-[#c1c1d8] bg-[#f8f8f8]">
      <h3 className="text-base mb-2 font-medium">{`${month}월`}</h3>
      {projects.map((project) => (
        <Link
          key={project.id}
          to={`/project/${project.id}/kanban`}
          className="flex cursor-pointer p-4 mb-2 bg-white rounded-md hover:bg-gray-200 shadow-sm"
        >
          <div className="flex flex-col">
            <h4 className="font-semibold">{project.name}</h4>
            <p className="text-sm text-gray-600">{project.description}</p>
          </div>
          <CircularProgress
            className="ml-auto"
            progress={project.progress}
            size={24}
            strokeWidth={5}
          />
        </Link>
      ))}
    </div>
  );
};

export default MonthlyProjectBox;
