import { gql } from "graphql-request";

export const GET_PROJECT_BY_ID = gql`
  query GetProjectById($id: ID!) {
    getProjectById(id: $id) {
      id
      name
      description
      createdAt
      endDate
      progress
      members {
        id
        email
        nickname
        isActive
      }
      tasks {
        id
        projectId
        name
        description
        status
        startDate
        endDate
        managers {
          id
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
          }
        }
      }
    }
  }
`;

export const GET_PROJECTS = gql`
  query GetProjects {
    getProjects {
      id
      name
      description
      createdAt
      endDate
      progress
    }
  }
`;

export const CREATE_PROJECT = gql`
  mutation CreateProject(
    $name: String!
    $description: String!
    $endDate: String
  ) {
    createProject(name: $name, description: $description, endDate: $endDate) {
      id
      name
      description
      createdAt
      endDate
      progress
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject(
    $id: ID!
    $name: String
    $description: String
    $members: [ID]
  ) {
    updateProject(
      id: $id
      name: $name
      description: $description
      members: $members
    ) {
      id
      name
      description
      updatedAt
      members {
        id
        nickname
      }
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id) {
      id
      name
      description
    }
  }
`;
