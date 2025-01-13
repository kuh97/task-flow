import { GRAPHQL_ENDPOINT } from "@/config/graphql";
import { GraphQLClient } from "graphql-request";
import { UPDATE_TASK_STATUS } from "@queries/taskQueries";
import Task, { Status } from "@models/Task";

const client = new GraphQLClient(GRAPHQL_ENDPOINT);

/**
 * Task status update api
 * @param taskId
 * @param status
 * @returns Task
 */
export const updateTaskStatus = async (
  taskId: string,
  status: Status
): Promise<Task> => {
  const variables = {
    id: taskId,
    status,
  };

  return client.request(UPDATE_TASK_STATUS, variables);
};
