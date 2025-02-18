import { gql } from "graphql-request";

export const UPDATE_ROLE = gql`
  mutation UpdateRole(
    $id: ID!
    $name: String
    $permissions: [String]
    $projectId: ID!
    $memberId: ID!
  ) {
    updateRole(
      id: $id
      name: $name
      permissions: $permissions
      projectId: $projectId
      memberId: $memberId
    ) {
      id
      name
      permissions
    }
  }
`;
