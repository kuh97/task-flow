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
      const previousTask = queryClient.getQueryData<Task>([
        "task",
        parentTaskId ? parentTaskId : taskId,
      ]);

      if (previousTask) {
        let updatedTask = { ...previousTask };

        if (parentTaskId) {
          // 하위 작업인 경우
          const updatedSubTasks = previousTask.subTasks.map((sub) => {
            if (sub.id === taskId) {
              const updatedComments = sub.comments.map((comment) => {
                if (comment.id === commentId) {
                  return { ...comment, content };
                }
                return comment;
              });
              return { ...sub, comments: updatedComments };
            }
            return sub;
          });

          updatedTask = { ...previousTask, subTasks: updatedSubTasks };
        } else {
          // 일반 작업인 경우
          const updatedComments = previousTask.comments.map((comment) => {
            if (comment.id === commentId) {
              return { ...comment, content };
            }
            return comment;
          });

          updatedTask = { ...previousTask, comments: updatedComments };
        }

        queryClient.setQueryData(
          ["task", parentTaskId ? parentTaskId : taskId],
          updatedTask
        );

        return { previousTask };
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["task", parentTaskId ? parentTaskId : taskId],
        (oldTask: Task | undefined) => {
          if (!oldTask) return oldTask;

          let updatedTask = { ...oldTask };

          if (parentTaskId) {
            // 하위 작업인 경우
            const updatedSubTasks = oldTask.subTasks.map((sub) => {
              if (sub.id === taskId) {
                const updatedComments = sub.comments.map((comment) => {
                  if (comment.id === data.updateComment.id) {
                    return { ...data.updateComment };
                  }
                  return comment;
                });
                return { ...sub, comments: updatedComments };
              }
              return sub;
            });
            updatedTask = { ...oldTask, subTasks: updatedSubTasks };
          } else {
            // 일반 작업인 경우
            const updatedComments = oldTask.comments.map((comment) => {
              if (comment.id === data.updateComment.id) {
                return { ...data.updateComment };
              }
              return comment;
            });

            updatedTask = { ...oldTask, comments: updatedComments };
          }
          queryClient.setQueryData(
            ["task", parentTaskId ? parentTaskId : taskId],
            updatedTask
          );
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
      const previousTask = queryClient.getQueryData<Task>([
        "task",
        parentTaskId ? parentTaskId : taskId,
      ]);

      if (previousTask) {
        let updatedTask = { ...previousTask };

        if (parentTaskId) {
          // 하위 작업인 경우
          const updatedSubTasks = previousTask.subTasks.map((sub) => {
            if (sub.id === taskId) {
              const updatedComments = sub.comments.filter(
                (comment) => comment.id !== commentId
              );
              return { ...sub, comments: updatedComments };
            }
            return sub;
          });

          updatedTask = { ...previousTask, subTasks: updatedSubTasks };
        } else {
          // 일반 작업인 경우
          const updatedComments = previousTask.comments.filter(
            (comment) => comment.id !== commentId
          );

          updatedTask = { ...previousTask, comments: updatedComments };
        }
        queryClient.setQueryData(
          ["task", parentTaskId ? parentTaskId : taskId],
          updatedTask
        );

        return { previousTask };
      }
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
      const previousTask = queryClient.getQueryData<Task>([
        "task",
        parentTaskId ? parentTaskId : taskId,
      ]);

      if (previousTask) {
        let updatedTask = { ...previousTask };

        if (parentTaskId) {
          // 하위 작업인 경우
          const updatedSubTasks = previousTask.subTasks.map((sub) => {
            if (sub.id === taskId) {
              const updatedComments = sub.comments.map((comment) => {
                if (comment.id === commentId) {
                  return {
                    ...comment,
                    likeCount: isLike
                      ? comment.likeCount + 1
                      : comment.likeCount - 1,
                    isClicked: isLike,
                  };
                }
                return comment;
              });
              return { ...sub, comments: updatedComments };
            }
            return sub;
          });
          updatedTask = { ...previousTask, subTasks: updatedSubTasks };
        } else {
          // 일반 작업인 경우
          const updatedComments = previousTask.comments.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                likeCount: isLike
                  ? comment.likeCount + 1
                  : comment.likeCount - 1,
                isClicked: isLike,
              };
            }
            return comment;
          });

          updatedTask = { ...previousTask, comments: updatedComments };
        }

        queryClient.setQueryData(
          ["task", parentTaskId ? parentTaskId : taskId],
          updatedTask
        );

        return { previousTask };
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["task", parentTaskId ? parentTaskId : taskId],
        (oldTask: Task | undefined) => {
          if (!oldTask) return oldTask;

          let updatedTask = { ...oldTask };

          if (parentTaskId) {
            // 하위 작업인 경우
            const updatedSubTasks = oldTask.subTasks.map((sub) => {
              if (sub.id === taskId) {
                const updatedComments = sub.comments.map((comment) => {
                  if (comment.id === data?.id) {
                    return data; // 서버에서 받은 전체 댓글 객체로 교체
                  }
                  return comment;
                });
                return { ...sub, comments: updatedComments };
              }
              return sub;
            });

            updatedTask = { ...oldTask, subTasks: updatedSubTasks };
          } else {
            // 일반 작업인 경우
            const updatedComments = oldTask.comments.map((comment) => {
              if (comment.id === data?.id) {
                return data; // 서버에서 받은 전체 댓글 객체로 교체
              }
              return comment;
            });

            updatedTask = { ...oldTask, comments: updatedComments };
          }

          queryClient.setQueryData(
            ["task", parentTaskId ? parentTaskId : taskId],
            updatedTask
          );
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
