import client from "./graphqlClient";
import {
  UPDATE_TASK_MUTATION,
  CREATE_TASK,
  CREATE_SUBTASK,
  DELETE_TASK,
  DELETE_SUBTASK,
  ADD_MEMBER_TO_TASK,
  REMOVE_MEMBER_FROM_TASK,
  GET_TASK_BY_ID,
} from "@queries/taskQueries";
import Task from "@models/Task";
import { TaskInput } from "@/hooks/task/useTaskMutation";
import { convertTaskDates } from "@/utils/convertDateFormat";

/**
 * Task update api
 * @param taskId
 * @param updateData
 * @returns Task
 */
export const updateTask = async (
  taskId: string,
  updateData: Partial<Task>
): Promise<Task> => {
  const variables = {
    id: taskId,
    ...updateData,
  };

  return client.request(UPDATE_TASK_MUTATION, variables);
};

/**
 * Task create api
 */
export const createTask = async (
  newTask: TaskInput
): Promise<{ createTask: Task }> => {
  const variables = {
    projectId: newTask.projectId,
    name: newTask.name,
    description: newTask.description,
    status: newTask.status,
    managers: newTask.managers,
    startDate: newTask.startDate,
    endDate: newTask.endDate,
    progress: newTask.progress,
    priority: newTask.priority,
  };

  return client.request(CREATE_TASK, variables);
};

/**
 * Task delete api
 */
export const deleteTask = async (
  taskId: string
): Promise<{ deleteTask: Task }> => {
  const variables = { id: taskId };
  return client.request(DELETE_TASK, variables);
};

/**
 * subTask create api
 */
export const createSubTask = async (
  parentTaskId: string,
  newSubTask: Omit<Task, "id" | "projectId" | "subTasks" | "managers">
): Promise<{ createSubTask: Task }> => {
  const variables = {
    parentTaskId,
    task: newSubTask,
  };

  return client.request(CREATE_SUBTASK, variables);
};

/**
 * subTask delete api
 */
export const deleteSubTask = async (
  parentTaskId: string,
  subTaskId: string
): Promise<{ deleteSubTask: Task }> => {
  const variables = { parentTaskId, subTaskId };

  return client.request(DELETE_SUBTASK, variables);
};

/**
 * addMemberToTask api
 */
export const addMemberToTask = async (
  taskId: string,
  memberId: string
): Promise<{ addMemberToTask: Task }> => {
  const variables = { taskId, memberId };

  return client.request(ADD_MEMBER_TO_TASK, variables);
};

/**
 * removeMemberToTask api
 */
export const removeMemberFromTask = async (
  taskId: string,
  memberId: string
): Promise<{ removeMemberFromTask: Task }> => {
  const variables = { taskId, memberId };

  return client.request(REMOVE_MEMBER_FROM_TASK, variables);
};

interface GetTaskByIdResponse {
  getTaskById: Task;
}

/**
 * task fetch by Id
 * @returns Task
 */
export const fetchTaskById = async (id: string): Promise<Task> => {
  const variables = {
    id,
  };
  const response = await client.request<GetTaskByIdResponse>(
    GET_TASK_BY_ID,
    variables
  );

  if (response.getTaskById) {
    response.getTaskById = convertTaskDates(response.getTaskById);
  }

  return response.getTaskById;
};
