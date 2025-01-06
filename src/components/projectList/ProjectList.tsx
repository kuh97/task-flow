import { useEffect, useState } from "react";
import { fromUnixTime, getMonth, getYear } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { fetchProjects } from "@api/projectApi";
import { ProjectBasic } from "@models/Project";
import MonthlyProjectBox from "@components/projectList/MonthlyProjectBox";
import SkeletonProject from "@components/projectList/SkeletonProject";

/**
 * 프로젝트 리스트 컴포넌트입니다.
 */
const ProjectList = () => {
  const [groupedProjects, setGroupedProjects] = useState<
    Map<number, Map<number, ProjectBasic[]>>
  >(new Map());

  // useQuery 훅을 사용하여 getProjects 호출
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  useEffect(() => {
    if (data && data.getProjects.length > 0) {
      const initialGroup: Map<number, Map<number, ProjectBasic[]>> = new Map();

      data.getProjects.forEach((project) => {
        const date = fromUnixTime(parseInt(project.createdAt) / 1000);
        const year = getYear(date);
        const month = getMonth(date) + 1;

        if (!initialGroup.has(year)) {
          initialGroup.set(year, new Map());
        }

        if (!initialGroup.get(year)?.has(month)) {
          initialGroup.get(year)?.set(month, []);
        }

        initialGroup.get(year)?.get(month)?.push(project);
      });

      setGroupedProjects(initialGroup);
    }
  }, [data]);

  // 로딩 중일 때
  if (isLoading) {
    return <SkeletonProject />;
  }

  // 에러 발생 시
  if (isError) return <div>Error: {error?.message}</div>;

  return (
    <div className="border-box mt-6 flex h-full justify-center">
      {Array.from(groupedProjects.entries()).map(([year, months]) => (
        <div key={year} className="w-full mb-5">
          <h2 className="text-xl font-semibold h-[40px] flex items-center">{`${year}년`}</h2>
          {Array.from(months.entries()).map(([month, projects]) => (
            <MonthlyProjectBox key={month} month={month} projects={projects} />
          ))}
        </div>
      ))}
      {groupedProjects.size === 0 && (
        <div className="text-lg font-semibold h-3/6 flex items-center">
          {"프로젝트를 생성해주세요."}
        </div>
      )}
    </div>
  );
};

export default ProjectList;
