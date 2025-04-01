import TaskComment from "@/models/TaskComment";
import client from "./graphqlClient";
import {
  CREATE_COMMENT,
  DELETE_COMMENT,
  LIKE_COMMENT,
  UNLIKE_COMMENT,
  UPDATE_COMMENT,
} from "@/queries/commentQueries";

/**
 * Task create api
 * @param newComment
 * @returns TaskComment
 */
export const createComment = async (
  newComment: Omit<TaskComment, "id">
): Promise<{ createComment: TaskComment }> => {
  const variables = {
    projectId: newComment.projectId,
    taskId: newComment.taskId,
    content: newComment.content,
  };

  return client.request(CREATE_COMMENT, variables);
};

/**
 * Comment update api
 * @param commentId
 * @param updateData
 * @returns TaskComment
 */
export const updateComment = async (
  commentId: string,
  content: string
): Promise<{ updateComment: TaskComment }> => {
  const variables = {
    id: commentId,
    content,
  };

  return client.request(UPDATE_COMMENT, variables);
};

/**
 * Comment delete api
 */
export const deleteComment = async (
  commentId: string
): Promise<{ deleteComment: TaskComment }> => {
  const variables = { id: commentId };
  return client.request(DELETE_COMMENT, variables);
};

interface LikeUnlikeResponse {
  comment: TaskComment;
}

/**
 * like Comment
 */
export const likeComment = async (commentId: string): Promise<TaskComment> => {
  const variables = {
    commentId,
  };

  const response = await client.request<LikeUnlikeResponse>(
    LIKE_COMMENT,
    variables
  );
  return response.comment;
};

/**
 * unlike Comment
 */
export const unlikeComment = async (
  commentId: string
): Promise<TaskComment> => {
  const variables = {
    commentId,
  };

  const response = await client.request<LikeUnlikeResponse>(
    UNLIKE_COMMENT,
    variables
  );
  return response.comment;
};
