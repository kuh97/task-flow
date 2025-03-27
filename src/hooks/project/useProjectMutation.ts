import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  fetchProjectById,
  removeMemberFromProject,
  createMemberFromProject,
  createProject,
} from "@api/projectApi";
import Project, { ProjectBasic } from "@models/Project";
import Member from "@models/Member";
import Role from "@models/Role";
import Task from "@models/Task";
import { useNavigate } from "react-router-dom";

interface UseProjectMutationsProps {
  projectId?: string;
  onSuccess?: () => void;
}

export const useProjectMutations = ({
  projectId,
  onSuccess,
}: UseProjectMutationsProps = {}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const createProjectMutation = useMutation<
    { createProject: ProjectBasic },
    Error,
    ProjectBasic
  >({
    mutationFn: createProject,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      navigate(`/project/${data.createProject.id}/kanban`);
      onSuccess?.();
    },
    onError: (error) => {
      console.error("프로젝트 생성 실패:", error);
    },
  });

  const removeMemberMutation = useMutation<
    { message: string },
    Error,
    { projectId: string; memberId: string }
  >({
    mutationFn: ({ projectId, memberId }) =>
      removeMemberFromProject(projectId, memberId),
    onSuccess: () => {
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      }
      onSuccess?.();
    },
    onError: (error) => {
      console.error("멤버 제거 실패:", error);
    },
  });

  const createMemberMutation = useMutation<
    { createMemberFromProject: { member: Member; role: Role } },
    Error,
    { email: string; name: string; permissions: string[]; projectId: string }
  >({
    mutationFn: ({ email, name, permissions, projectId }) =>
      createMemberFromProject(email, name, permissions, projectId),
    onSuccess: (data, variables) => {
      queryClient.setQueryData<{ getProjectById: Project } | undefined>(
        ["project", variables.projectId],
        (oldData) => {
          if (!oldData) return oldData;
          const newMember = {
            ...data.createMemberFromProject.member,
            role: data.createMemberFromProject.role,
          };
          return {
            ...oldData,
            getProjectById: {
              ...oldData.getProjectById,
              members: [...oldData.getProjectById.members, newMember],
            },
          };
        }
      );
      queryClient.invalidateQueries({
        queryKey: ["project", variables.projectId],
      });
      onSuccess?.();
    },
    onError: (error) => {
      console.error("멤버 생성 실패:", error);
    },
  });

  return {
    createProject: createProjectMutation.mutate,
    removeMember: removeMemberMutation.mutate,
    createMember: createMemberMutation.mutate,
  };
};

export const useProjectData = (projectId: string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const projectData = await fetchProjectById(projectId!);
      // 개별 Task 캐싱
      projectData.getProjectById.tasks.forEach((task: Task) => {
        if (task.id) {
          queryClient.setQueryData(["task", task.id], task); // Task만 캐싱
        }
      });
      return projectData;
    },
    enabled: !!projectId, // id가 없을 경우 쿼리 실행 차단
  });

  return {
    data: data?.getProjectById ?? null,
    isLoading,
    isError,
    error,
  };
};
