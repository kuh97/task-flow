import { gql } from "graphql-request";

export const GET_TASK_BY_ID = gql`
  query GetTaskById($id: ID!) {
    getTaskById(id: $id) {
      id
      projectId
      name
      description
      status
      startDate
      endDate
      progress
      managers {
        id
        email
        nickname
        isActive
        profileImage
      }
      subTasks {
        id
        projectId
        name
        description
        status
        startDate
        endDate
        managers {
          id
          email
          nickname
          isActive
          profileImage
        }
        comments {
          id
          projectId
          taskId
          member {
            id
            email
            nickname
            isActive
            profileImage
          }
          content
          createdAt
          updatedAt
          expiredAt
          likeCount
          isClicked
        }
      }
      comments {
        id
        projectId
        taskId
        member {
          id
          email
          nickname
          isActive
          profileImage
        }
        content
        createdAt
        updatedAt
        expiredAt
        likeCount
        isClicked
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

export const CREATE_TASK = gql`
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
        email
        nickname
        isActive
        profileImage
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
        email
        nickname
        isActive
        profileImage
      }
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      id
    }
  }
`;

export const CREATE_SUBTASK = gql`
  mutation CreateSubTask($parentTaskId: ID!, $task: TaskInput!) {
    createSubTask(parentTaskId: $parentTaskId, task: $task) {
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
      subTasks {
        id
        name
      }
    }
  }
`;

export const DELETE_SUBTASK = gql`
  mutation DeleteSubTask($parentTaskId: ID!, $subTaskId: ID!) {
    deleteSubTask(parentTaskId: $parentTaskId, subTaskId: $subTaskId) {
      id
      subTasks {
        id
      }
    }
  }
`;

export const ADD_MEMBER_TO_TASK = gql`
  mutation AddMemberToTask($taskId: ID!, $memberId: ID!) {
    addMemberToTask(taskId: $taskId, memberId: $memberId) {
      id
      managers {
        id
        email
        nickname
        isActive
        profileImage
      }
    }
  }
`;

export const REMOVE_MEMBER_FROM_TASK = gql`
  mutation RemoveMemberFromTask($taskId: ID!, $memberId: ID!) {
    removeMemberFromTask(taskId: $taskId, memberId: $memberId) {
      id
      managers {
        id
        email
        nickname
        isActive
        profileImage
      }
    }
  }
`;
