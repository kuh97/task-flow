import { gql } from "graphql-request";

export const CREATE_COMMENT = gql`
  mutation CreateComment($projectId: ID!, $taskId: ID, $content: String!) {
    createComment(projectId: $projectId, taskId: $taskId, content: $content) {
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
`;

export const UPDATE_COMMENT = gql`
  mutation UpdateComment($id: ID!, $content: String!) {
    updateComment(id: $id, content: $content) {
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
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($id: ID!) {
    deleteComment(id: $id) {
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
`;

export const LIKE_COMMENT = gql`
  mutation CreateLike($commentId: ID!) {
    createLike(commentId: $commentId) {
      id
      comment {
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

export const UNLIKE_COMMENT = gql`
  mutation DeleteLike($commentId: ID!) {
    deleteLike(commentId: $commentId) {
      id
      comment {
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
