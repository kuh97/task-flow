import { gql } from "graphql-request";

export const GET_MEMBER_BY_ID = gql`
  query GetMemberById($id: ID!) {
    getMemberById(id: $id) {
      id
      email
      nickname
      isActive
    }
  }
`;

export const GET_MEMBERS = gql`
  query GetMembers {
    getMembers {
      id
      email
      nickname
      isActive
    }
  }
`;

export const CREATE_MEMBER_MUTATION = gql`
  mutation CreateMember(
    $email: String!
    $nickname: String!
    $isActive: Boolean
  ) {
    createMember(email: $email, nickname: $nickname, isActive: $isActive) {
      id
      email
      nickname
      isActive
    }
  }
`;

export const UPDATE_MEMBER_MUTATION = gql`
  mutation UpdateMember(
    $id: ID!
    $email: String
    $nickname: String
    $isActive: Boolean
  ) {
    updateMember(
      id: $id
      email: $email
      nickname: $nickname
      isActive: $isActive
    ) {
      id
      email
      nickname
      isActive
    }
  }
`;

export const DELETE_MEMBER_MUTATION = gql`
  mutation DeleteMember($id: ID!) {
    deleteMember(id: $id) {
      id
      email
      nickname
      isActive
    }
  }
`;
