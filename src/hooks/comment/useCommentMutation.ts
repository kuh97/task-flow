import { useMutation, useQueryClient } from "@tanstack/react-query";
import TaskComment from "@models/TaskComment";
import {
  createComment,
  deleteComment,
  likeComment,
  unlikeComment,
  updateComment,
} from "@/api/commentApi";
import Task from "@/models/Task";

interface UseCommentMutationProps {
  parentTaskId?: string;
  taskId: string;
  onSuccess?: () => void;
}

export const useCommentMutations = ({
  parentTaskId,
  taskId,
  onSuccess,
}: UseCommentMutationProps) => {
  const queryClient = useQueryClient();

  // 댓글 생성
  const createCommentMutation = useMutation<
    { createComment: TaskComment },
    Error,
    { newComment: Omit<TaskComment, "id"> }
  >({
    mutationFn: ({ newComment }) => createComment(newComment), // comment 생성 API 호출
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["task", parentTaskId ? parentTaskId : taskId],
      });
      onSuccess?.();
    },
    onError: (error) => {
      console.error("댓글 생성 실패:", error);
    },
  });

  // 댓글 수정
  const updateCommentMutation = useMutation<
    { updateComment: TaskComment },
    Error,
    { commentId: string; content: string },
    { previousTask: Task | undefined }
  >({
    mutationFn: ({ commentId, content }) => updateComment(commentId, content), // comment 업데이트 API 호출
    onMutate: async ({ commentId, content }) => {
      await queryClient.cancelQueries({
        queryKey: ["task", parentTaskId ? parentTaskId : taskId],
      });

      // 낙관적 업데이트 적용
      const previousTask =
        queryClient.getQueryData<Task>([
          "task",
          parentTaskId ? parentTaskId : taskId,
        ]) || undefined;

      if (previousTask) {
        if (parentTaskId) {
          const targetChildTask = previousTask.subTasks.filter(
            (task) => task.id === taskId
          )[0];
          const updatedComments = targetChildTask.comments.map((comment) =>
            comment.id === commentId
              ? { ...comment, content } // 수정된 댓글로 교체
              : comment
          );
          targetChildTask.comments = updatedComments;

          queryClient.setQueryData(["task", parentTaskId], {
            ...previousTask,
            subTasks: [
              ...previousTask.subTasks.filter((sub) => sub.id !== taskId),
              targetChildTask,
            ],
          });
        } else {
          const updatedComments = previousTask.comments.map((comment) =>
            comment.id === commentId
              ? { ...comment, content } // 수정된 댓글로 교체
              : comment
          );

          queryClient.setQueryData(["task", taskId], {
            ...previousTask,
            comments: updatedComments,
          });
        }
      }

      return { previousTask };
    },
    onSettled: (data) => {
      queryClient.setQueryData(
        ["task", parentTaskId ? parentTaskId : taskId],
        (oldTask: Task | undefined) => {
          if (!oldTask) return oldTask;

          if (parentTaskId) {
            const targetChildTask = oldTask.subTasks.find(
              (task) => task.id === taskId
            );

            if (!targetChildTask) return oldTask;

            const updatedComments = targetChildTask.comments.map((comment) =>
              comment.id === data?.updateComment.id
                ? data.updateComment
                : comment
            );

            const updatedSubTasks = oldTask.subTasks.map((sub) =>
              sub.id === taskId ? { ...sub, comments: updatedComments } : sub
            );

            return { ...oldTask, subTasks: updatedSubTasks };
          } else {
            const updatedComments = oldTask.comments.map((comment) =>
              comment.id === data?.updateComment.id
                ? data.updateComment
                : comment
            );

            return { ...oldTask, comments: updatedComments };
          }
        }
      );

      onSuccess?.();
    },
    onError: (error, _, context) => {
      // 에러가 발생하면, 낙관적 업데이트 전에 있던 이전 상태로 복원
      if (context?.previousTask) {
        queryClient.setQueryData(
          ["task", parentTaskId ? parentTaskId : taskId],
          context.previousTask
        );
      }
      console.error("댓글 수정 실패:", error);
    },
  });

  // 댓글 삭제
  const deleteCommentMutation = useMutation<
    { deleteComment: TaskComment },
    Error,
    { commentId: string },
    { previousTask: Task | undefined }
  >({
    mutationFn: ({ commentId }) => deleteComment(commentId), // comment 삭제 API 호출
    onMutate: async ({ commentId }) => {
      await queryClient.cancelQueries({
        queryKey: ["task", parentTaskId ? parentTaskId : taskId],
      });

      // 낙관적 업데이트 적용
      const previousTask =
        queryClient.getQueryData<Task>([
          "task",
          parentTaskId ? parentTaskId : taskId,
        ]) || undefined;

      if (previousTask) {
        if (parentTaskId) {
          const targetChildTask = previousTask.subTasks.filter(
            (sub) => sub.id === taskId
          )[0];
          const updatedComments = targetChildTask.comments.filter(
            (comment) => comment.id !== commentId
          );
          targetChildTask.comments = updatedComments;

          queryClient.setQueryData(["task", parentTaskId], {
            ...previousTask,
            subTasks: [
              ...previousTask.subTasks.filter((sub) => sub.id !== taskId),
              targetChildTask,
            ],
          });
        } else {
          const updatedComments = previousTask.comments.filter(
            (comment) => comment.id !== commentId
          );

          queryClient.setQueryData(["task", taskId], {
            ...previousTask,
            comments: updatedComments,
          });
        }
      }

      return { previousTask };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["task", parentTaskId ? parentTaskId : taskId],
      });
      onSuccess?.();
    },
    onError: (error, _, context) => {
      // 롤백 (Rollback)
      if (context?.previousTask) {
        queryClient.setQueryData(
          ["task", parentTaskId ? parentTaskId : taskId],
          context.previousTask
        );
      }
      console.error("댓글 삭제 실패:", error);
    },
  });

  const toggleLikeCommentMutation = useMutation<
    TaskComment,
    Error,
    { commentId: string; isLike: boolean },
    { previousTask: Task | undefined }
  >({
    mutationFn: ({ commentId, isLike }) =>
      isLike ? likeComment(commentId) : unlikeComment(commentId),
    onMutate: async ({ commentId, isLike }) => {
      await queryClient.cancelQueries({
        queryKey: ["task", parentTaskId ? parentTaskId : taskId],
      });

      // 낙관적 업데이트 적용
      const previousTask =
        queryClient.getQueryData<Task>([
          "task",
          parentTaskId ? parentTaskId : taskId,
        ]) || undefined;

      if (previousTask) {
        if (parentTaskId) {
          const targetChildTask = previousTask.subTasks.filter(
            (sub) => sub.id === taskId
          )[0];
          const updatedComments = targetChildTask.comments.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  likeCount: isLike
                    ? comment.likeCount + 1
                    : comment.likeCount - 1,
                  isClicked: !comment.isClicked,
                }
              : comment
          );
          targetChildTask.comments = updatedComments;

          queryClient.setQueryData(["task", parentTaskId], {
            ...previousTask,
            subTasks: [
              ...previousTask.subTasks.filter((sub) => sub.id !== taskId),
              targetChildTask,
            ],
          });
        } else {
          const updatedComments = previousTask.comments.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  likeCount: isLike
                    ? comment.likeCount + 1
                    : comment.likeCount - 1,
                  isClicked: !comment.isClicked,
                }
              : comment
          );

          queryClient.setQueryData(["task", taskId], {
            ...previousTask,
            comments: updatedComments,
          });
        }
      }

      return { previousTask };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["task", parentTaskId ? parentTaskId : taskId],
        (oldTask: Task | undefined) => {
          if (!oldTask) return oldTask;

          if (parentTaskId) {
            const updatedSubTasks = oldTask.subTasks.map((sub) =>
              sub.id === taskId
                ? {
                    ...sub,
                    comments: sub.comments.map((comment) =>
                      comment.id === data?.id ? data : comment
                    ),
                  }
                : sub
            );

            return { ...oldTask, subTasks: updatedSubTasks };
          } else {
            const updatedComments = oldTask.comments.map((comment) =>
              comment.id === data?.id ? data : comment
            );

            return { ...oldTask, comments: updatedComments };
          }
        }
      );

      onSuccess?.();
    },
    onError: (error, _, context) => {
      // 롤백 (Rollback)
      if (context?.previousTask) {
        queryClient.setQueryData(
          ["task", parentTaskId ? parentTaskId : taskId],
          context.previousTask
        );
      }
      console.error("좋아요 실패:", error);
    },
  });

  return {
    createComment: createCommentMutation.mutate,
    updateComment: updateCommentMutation.mutate,
    deleteComment: deleteCommentMutation.mutate,
    toggleLikeComment: toggleLikeCommentMutation.mutate,
  };
};
