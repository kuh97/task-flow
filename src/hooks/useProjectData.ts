import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchProjectById } from "@api/projectApi";

export const useProjectData = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["project", id],
    queryFn: () => fetchProjectById(id!),
    enabled: !!id, // id가 없을 경우 쿼리 실행 차단
  });

  return {
    data: data?.getProjectById ?? null,
    isLoading,
    isError,
    error,
  };
};
