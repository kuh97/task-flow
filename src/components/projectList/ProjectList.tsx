import { useProjectStore } from "@store/useProjectStore";
import { useEffect, useState } from "react";
import Project from "@models/Project";
import { getMonth, getYear } from "date-fns";
import MonthlyProjectBox from "@components/projectList/MonthlyProjectBox";

/**
 * 프로젝트 리스트 컴포넌트입니다.
 */
function ProjectList() {
  const projects = useProjectStore((state) => state.projects); // 최신순으로 sort되어 넘어온다고 가정
  const [groupedProjects, setGroupedProjects] = useState<
    Map<number, Map<number, Project[]>>
  >(new Map());

  useEffect(() => {
    const initialGroup: Map<number, Map<number, Project[]>> = new Map();
    projects.forEach((project) => {
      const year = getYear(project.createdAt);
      const month = getMonth(project.createdAt) + 1;
      if (!initialGroup.has(year)) {
        initialGroup.set(year, new Map());
      }

      if (!initialGroup.get(year)?.has(month)) {
        initialGroup.get(year)?.set(month, []);
      }

      initialGroup.get(year)?.get(month)?.push(project);
    });
    setGroupedProjects(initialGroup);
  }, [projects]);

  return (
    <div className="box-border mt-10">
      {Array.from(groupedProjects.entries()).map(([year, months]) => (
        <div key={year} className="mb-5">
          <h2 className="text-xl font-semibold h-[40px] flex items-center">{`${year}년`}</h2>
          {Array.from(months.entries()).map(([month, projects]) => (
            <MonthlyProjectBox key={month} month={month} projects={projects} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default ProjectList;
