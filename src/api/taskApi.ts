import { GRAPHQL_ENDPOINT } from "@/config/graphql";
import { GraphQLClient } from "graphql-request";
import {
  UPDATE_TASK_MUTATION,
  CREATE_TASK,
  CREATE_SUBTASK,
} from "@queries/taskQueries";
import Task from "@models/Task";

const client = new GraphQLClient(GRAPHQL_ENDPOINT);

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
  newTask: Task
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