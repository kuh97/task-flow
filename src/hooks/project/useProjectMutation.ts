import { useQuery } from "@tanstack/react-query";
import { fetchProjectById } from "@api/projectApi";

export const useProjectData = (projectId: string) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchProjectById(projectId!),
    enabled: !!projectId, // id가 없을 경우 쿼리 실행 차단
  });

  return {
    data: data?.getProjectById ?? null,
    isLoading,
    isError,
    error,
  };
};
