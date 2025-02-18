import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRole } from "@/api/roleApi";
import Role from "@/models/Role";
import Project from "@/models/Project";

interface UseRoleMutationProps {
  projectId: string;
  onSuccess?: () => void;
}

export const useRoleMutations = ({
  projectId,
  onSuccess,
}: UseRoleMutationProps) => {
  const queryClient = useQueryClient();

  const updateRoleMutation = useMutation<
    { role: Role },
    Error,
    Role,
    { previousProject: { getProjectById: Project } | undefined }
  >({
    mutationFn: (updateData) => updateRole(updateData),
    onMutate: async (updateData) => {
      await queryClient.cancelQueries({ queryKey: ["project", projectId] });

      const previousProject = queryClient.getQueryData<{
        getProjectById: Project;
      }>(["project", projectId]);

      if (previousProject) {
        const { getProjectById: project } = previousProject;
        queryClient.setQueryData(["project", projectId], {
          getProjectById: {
            ...project,
            members: project.members.map((member) => {
              if (member.id === updateData.memberId) {
                return { ...member, role: { ...updateData } };
              }
              return member;
            }),
          },
        });
      }

      return { previousProject };
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["project", projectId],
      });
      onSuccess?.();
    },
    onError: (err, newRole, context) => {
      if (context?.previousProject) {
        queryClient.setQueryData(
          ["project", projectId],
          context.previousProject
        );
      }
    },
  });

  return {
    updateRole: updateRoleMutation.mutate,
  };
};
