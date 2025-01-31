import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSubTask,
  createTask,
  updateTask,
  deleteTask,
  deleteSubTask,
} from "@/api/taskApi";
import Task from "@/models/Task";
import Project from "@/models/Project";

interface UseTaskMutationProps {
  projectId: string;
  onSuccess?: () => void;
}

export const useTaskMutations = ({
  projectId,
  onSuccess,
}: UseTaskMutationProps) => {
  const queryClient = useQueryClient();

  const updateTaskMutation = useMutation<
    Task,
    Error,
    Partial<Task> & { id: string; parentTaskId?: string },
    { previousProject: { getProjectById: Project } | undefined }
  >({
    mutationFn: (updateData) => updateTask(updateData.id!, updateData),
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
            tasks: project.tasks.map((task) => {
              if (task.id === updateData.id) {
                return { ...task, ...updateData };
              } else if (task.id === updateData.parentTaskId) {
                return {
                  ...task,
                  subTasks: task.subTasks.map((subTask) =>
                    subTask.id === updateData.id
                      ? { ...subTask, ...updateData }
                      : subTask
                  ),
                };
              }
              return task;
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
    onError: (err, variables, context) => {
      if (context?.previousProject) {
        queryClient.setQueryData(
          ["project", projectId],
          context.previousProject
        );
      }
    },
  });

  const createTaskMutation = useMutation<{ createTask: Task }, Error, Task>({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project"] });
    },
    onError: (error) => {
      console.error("작업 생성 실패:", error);
    },
  });

  const deleteTaskMutation = useMutation<
    { deleteTask: Task },
    Error,
    { taskId: string },
    { previousProject: { getProjectById: Project } | undefined }
  >({
    mutationFn: ({ taskId }) => deleteTask(taskId),
    onMutate: async ({ taskId }) => {
      await queryClient.cancelQueries({ queryKey: ["project", projectId] });

      const previousProject = queryClient.getQueryData<{
        getProjectById: Project;
      }>(["project", projectId]);

      if (previousProject) {
        const updatedTasks = previousProject.getProjectById.tasks.filter(
          (task) => task.id !== taskId
        );
        queryClient.setQueryData(["project", projectId], {
          getProjectById: {
            ...previousProject.getProjectById,
            tasks: updatedTasks,
          },
        });
      }

      return { previousProject };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
    onError: (error, _, context) => {
      console.error("작업 삭제 실패:", error);
      if (context?.previousProject) {
        queryClient.setQueryData(
          ["project", projectId],
          context.previousProject
        );
      }
    },
  });

  const createSubTaskMutation = useMutation<
    { createSubTask: Task },
    Error,
    {
      parentTaskId: string;
      subTask: Omit<Task, "id" | "projectId" | "subTasks" | "managers">;
    }
  >({
    mutationFn: ({ parentTaskId, subTask }) =>
      createSubTask(parentTaskId, subTask),
    onSuccess: (data, variables) => {
      queryClient.setQueryData<{ getProjectById: Project } | undefined>(
        ["project", projectId],
        (oldData) => {
          if (!oldData) return oldData;
          const updatedTasks = oldData.getProjectById.tasks.map((task) => {
            if (task.id === variables.parentTaskId) {
              return {
                ...task,
                subTasks: [...(task.subTasks || []), data.createSubTask],
              };
            }
            return task;
          });
          return {
            ...oldData,
            getProjectById: {
              ...oldData.getProjectById,
              tasks: updatedTasks,
            },
          };
        }
      );
      queryClient.invalidateQueries({ queryKey: ["project"] });
    },
    onError: (error) => {
      console.error("하위 작업 생성 실패:", error);
    },
  });

  const deleteSubTaskMutation = useMutation<
    { deleteSubTask: Task },
    Error,
    { parentTaskId: string; subTaskId: string },
    { previousProject: { getProjectById: Project } | undefined }
  >({
    mutationFn: ({ parentTaskId, subTaskId }) =>
      deleteSubTask(parentTaskId, subTaskId),
    onMutate: async ({ parentTaskId, subTaskId }) => {
      await queryClient.cancelQueries({ queryKey: ["project", projectId] });

      const previousProject = queryClient.getQueryData<{
        getProjectById: Project;
      }>(["project", projectId]);

      if (previousProject) {
        const updatedTasks = previousProject.getProjectById.tasks.map(
          (task) => {
            if (task.id === parentTaskId) {
              return {
                ...task,
                subTasks: task.subTasks.filter(
                  (subTask) => subTask.id !== subTaskId
                ),
              };
            }
            return task;
          }
        );

        queryClient.setQueryData(["project", projectId], {
          getProjectById: {
            ...previousProject.getProjectById,
            tasks: updatedTasks,
          },
        });
      }

      return { previousProject };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
    onError: (error, _, context) => {
      console.error("서브태스크 삭제 실패:", error);
      if (context?.previousProject) {
        queryClient.setQueryData(
          ["project", projectId],
          context.previousProject
        );
      }
    },
  });

  return {
    updateTask: updateTaskMutation.mutate,
    createTask: createTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    createSubTask: createSubTaskMutation.mutate,
    deleteSubTask: deleteSubTaskMutation.mutate,
  };
};
