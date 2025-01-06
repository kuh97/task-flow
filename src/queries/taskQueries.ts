import { gql } from "graphql-request";

export const GET_TASK_BY_ID = gql`
  query GetTaskById($id: ID!) {
    getTaskById(id: $id) {
      id
      name
      description
      status
      priority
      progress
      projectId
      managers {
        id
        nickname
      }
      subTasks {
        id
        name
      }
    }
  }
`;

export const GET_TASKS = gql`
  query GetTasks {
    getTasks {
      id
      name
      description
      status
      priority
      progress
      projectId
      managers {
        id
        nickname
      }
      subTasks {
        id
        name
      }
    }
  }
`;

export const CREATE_TASK_MUTATION = gql`
  mutation CreateTask(
    $projectId: ID!
    $name: String!
    $description: String
    $status: String!
    $managers: [ID]
    $startDate: String
    $endDate: String
    $progress: Int
    $priority: Boolean
  ) {
    createTask(
      projectId: $projectId
      name: $name
      description: $description
      status: $status
      managers: $managers
      startDate: $startDate
      endDate: $endDate
      progress: $progress
      priority: $priority
    ) {
      id
      name
      description
      status
      priority
      progress
      managers {
        id
        nickname
      }
    }
  }
`;

export const UPDATE_TASK_MUTATION = gql`
  mutation UpdateTask(
    $id: ID!
    $name: String
    $description: String
    $status: String
    $managers: [ID]
    $startDate: String
    $endDate: String
    $progress: Int
    $priority: Boolean
  ) {
    updateTask(
      id: $id
      name: $name
      description: $description
      status: $status
      managers: $managers
      startDate: $startDate
      endDate: $endDate
      progress: $progress
      priority: $priority
    ) {
      id
      name
      description
      status
      priority
      progress
      managers {
        id
        nickname
      }
    }
  }
`;

export const DELETE_TASK_MUTATION = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      id
      name
      description
      status
    }
  }
`;
