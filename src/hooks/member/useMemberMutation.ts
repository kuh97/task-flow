import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMember, updateMember, deleteMember } from "@/api/memberApi";
import Member from "@/models/Member";
import Project from "@/models/Project";

interface UseMemberMutationProps {
  projectId: string;
  onSuccess?: () => void;
}

export const useMemberMutations = ({
  projectId,
  onSuccess,
}: UseMemberMutationProps) => {
  const queryClient = useQueryClient();

  const updateMemberMutation = useMutation<
    Member,
    Error,
    Partial<Member>,
    { previousProject: { getProjectById: Project } | undefined }
  >({
    mutationFn: (updateData) => updateMember(updateData.id!, updateData),
    onMutate: async (updateData) => {
      await queryClient.cancelQueries({
        queryKey: ["project", projectId],
      });

      const previousProject = queryClient.getQueryData<{
        getProjectById: Project;
      }>(["project", projectId]);

      if (previousProject) {
        const { getProjectById: project } = previousProject;
        queryClient.setQueryData(["project", projectId], {
          getProjectById: {
            ...project,
            members: project.members.map((member) => {
              if (member.id === updateData.id) {
                return { ...member, ...updateData };
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
      //   onSuccess?.();
    },
    onError: (err, variables, context) => {
      if (context?.previousProject) {
        queryClient.setQueryData(
          ["project", projectId],
          context.previousProject
        );
      }
    },
  });

  const createMemberMutation = useMutation<
    { createMember: Member },
    Error,
    Member
  >({
    mutationFn: createMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project"] });
    },
    onError: (error) => {
      console.log("멤버 생성 실패", error);
    },
  });

  const deleteMemberMutation = useMutation<
    { deleteMember: Member },
    Error,
    { memberId: string },
    { previousProject: { getProjectById: Project } | undefined }
  >({
    mutationFn: ({ memberId }) => deleteMember(memberId),
    onMutate: async ({ memberId }) => {
      await queryClient.cancelQueries({ queryKey: ["project", projectId] });

      const previousProject = queryClient.getQueryData<{
        getProjectById: Project;
      }>(["project", projectId]);

      if (previousProject) {
        const updatedMembers = previousProject.getProjectById.members.filter(
          (member) => member.id !== memberId
        );
        queryClient.setQueryData(["project", projectId], {
          getProjectById: {
            ...previousProject.getProjectById,
            members: updatedMembers,
          },
        });
      }

      return { previousProject };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
    onError: (error, _, context) => {
      console.log("멤버 삭제 실패:", error);
      if (context?.previousProject) {
        queryClient.setQueryData(
          ["proejct", projectId],
          context.previousProject
        );
      }
    },
  });

  return {
    updateMember: updateMemberMutation.mutate,
    createMemeber: createMemberMutation.mutate,
    deleteMember: deleteMemberMutation.mutate,
  };
};
