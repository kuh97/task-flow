import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSubTask,
  createTask,
  updateTask,
  deleteTask,
  deleteSubTask,
  addMemberToTask,
  removeMemberFromTask,
  fetchTaskById,
} from "@/api/taskApi";
import Task, { Status } from "@/models/Task";
import Project from "@/models/Project";

interface UseTaskMutationProps {
  projectId: string;
  onSuccess?: () => void;
}

export interface TaskInput {
  id?: string; // Optional, for update
  projectId: string;
  name: string;
  description: string;
  status: Status;
  managers: string[];
  startDate: string;
  endDate: string;
  progress: number;
  priority?: boolean;
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

  const createTaskMutation = useMutation<
    { createTask: Task },
    Error,
    TaskInput
  >({
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
      subTask: Omit<TaskInput, "id" | "projectId" | "subTasks" | "managers">;
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

  const addMemberToTaskMutation = useMutation<
    { addMemberToTask: Task },
    Error,
    { taskId: string; memberId: string; parentTaskId?: string }
  >({
    mutationFn: ({ taskId, memberId }) => addMemberToTask(taskId, memberId),
    onSuccess: (data, variables) => {
      queryClient.setQueryData<{ getProjectById: Project } | undefined>(
        ["project", projectId],
        (oldData) => {
          if (!oldData) return oldData;

          const isSubTask = !!variables.parentTaskId;

          const updatedTasks = oldData.getProjectById.tasks.map((task) => {
            if (isSubTask) {
              // 하위 작업일 경우: 부모 작업 탐색
              if (task.id === variables.parentTaskId) {
                return {
                  ...task,
                  subTasks: task.subTasks.map((subTask) =>
                    subTask.id === variables.taskId
                      ? { ...subTask, managers: data.addMemberToTask.managers }
                      : subTask
                  ),
                };
              }
            } else {
              // 상위 작업일 경우: 직접 업데이트
              if (task.id === variables.taskId) {
                return {
                  ...task,
                  managers: data.addMemberToTask.managers,
                };
              }
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
    },
    onError: (error) => {
      console.log("멤버 추가 실패", error);
    },
  });

  const removeMemberFromTaskMutation = useMutation<
    { removeMemberFromTask: Task },
    Error,
    { taskId: string; memberId: string; parentTaskId?: string }
  >({
    mutationFn: ({ taskId, memberId }) =>
      removeMemberFromTask(taskId, memberId),
    onSuccess: (data, variables) => {
      queryClient.setQueryData<{ getProjectById: Project } | undefined>(
        ["project", projectId],
        (oldData) => {
          if (!oldData) return oldData;

          const isSubTask = !!variables.parentTaskId;

          const updatedTasks = oldData.getProjectById.tasks.map((task) => {
            if (isSubTask) {
              // 하위 작업일 경우: 부모 작업 탐색
              if (task.id === variables.parentTaskId) {
                return {
                  ...task,
                  subTasks: task.subTasks.map((subTask) =>
                    subTask.id === variables.taskId
                      ? {
                          ...subTask,
                          managers: data.removeMemberFromTask.managers,
                        }
                      : subTask
                  ),
                };
              }
            } else {
              // 상위 작업일 경우: 직접 업데이트
              if (task.id === variables.taskId) {
                return {
                  ...task,
                  managers: data.removeMemberFromTask.managers,
                };
              }
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
    },
    onError: (error) => {
      console.error("멤버 제거 실패:", error);
    },
  });

  return {
    updateTask: updateTaskMutation.mutate,
    createTask: createTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    createSubTask: createSubTaskMutation.mutate,
    deleteSubTask: deleteSubTaskMutation.mutate,
    addMemberToTask: addMemberToTaskMutation.mutate,
    removeMemberFromTask: removeMemberFromTaskMutation.mutate,
  };
};

export const useTaskData = (taskId: string) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const taskData = await fetchTaskById(taskId!);
      return taskData;
    },
    enabled: !!taskId, // id가 없을 경우 쿼리 실행 차단
  });

  return {
    data: data ?? null,
    isLoading,
    isError,
    error,
  };
};
