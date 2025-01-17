import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSubTask, createTask, updateTask } from "@/api/taskApi";
import Task from "@/models/Task";
import Project from "@/models/Project";

interface UseTaskMutationProps {
  projectId: string;
}

export const useUpdateTaskMutation = ({ projectId }: UseTaskMutationProps) => {
  const queryClient = useQueryClient();

  return useMutation<
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

      const getProjectById = queryClient.getQueryData<{
        getProjectById: Project;
      }>(["project", projectId]);

      if (getProjectById) {
        const { getProjectById: previousProject } = getProjectById;
        // 일반 task 업데이트
        queryClient.setQueryData(["project", projectId], {
          getProjectById: {
            ...previousProject,
            tasks: previousProject.tasks.map((task) => {
              if (task.id === updateData.id) {
                return { ...task, ...updateData };
              } else if (task.id === updateData.parentTaskId) {
                // 자식 task 업데이트
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

      return { previousProject: getProjectById };
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["project", projectId],
      });
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
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { createTask: Task },
    Error,
    Task & { parentTaskId?: string }
  >({
    mutationFn: (newTask) => createTask(newTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project"] });
    },
    onError: (error) => {
      console.error("작업 생성 실패:", error);
    },
  });
};

export const useCreateSubTask = () => {
  const queryClient = useQueryClient();

  return useMutation<
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
        ["project", variables.parentTaskId],
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
};
