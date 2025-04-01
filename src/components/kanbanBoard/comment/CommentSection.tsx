import { useCommentMutations } from "@/hooks/comment/useCommentMutation";
import TaskComment from "@/models/TaskComment";
import { useAppStore } from "@/store/useAppStore";
import { format } from "date-fns";
import { useState } from "react";
import CommentItem from "./CommentItem";

interface CommentSectionProps {
  projectId: string;
  taskId: string;
  parentTaskId?: string;
  comments: TaskComment[];
}

const CommentSection = ({
  projectId,
  taskId,
  parentTaskId,
  comments,
}: CommentSectionProps) => {
  const { loginMember } = useAppStore();

  const [commentText, setCommentText] = useState<string>("");

  const { createComment, updateComment, deleteComment, toggleLikeComment } =
    useCommentMutations({
      taskId,
      parentTaskId,
    });

  const handleCommentSubmit = () => {
    if (loginMember && commentText.trim()) {
      const newComment = {
        projectId,
        taskId,
        member: loginMember,
        author: `${loginMember.nickname}`,
        content: commentText,
        createdAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        updatedAt: "",
        expiredAt: "",
        likeCount: 0,
        isClicked: false,
      };
      createComment({
        newComment: newComment,
      });
      setCommentText("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end pb-4">
        <textarea
          className="w-full text-sm p-2 border rounded-md resize-none"
          rows={1}
          placeholder="댓글을 작성하세요"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button
          className="w-20 px-2 py-2 ml-2 bg-primary text-sm text-white rounded-md hover:bg-primary-hover"
          onClick={handleCommentSubmit}
        >
          작성
        </button>
      </div>
      <div className="space-y-4">
        {comments
          .sort((a, b) => parseInt(b.createdAt) - parseInt(a.createdAt))
          .map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              updateComment={updateComment}
              deleteComment={deleteComment}
              toggleLikeComment={toggleLikeComment}
            />
          ))}
      </div>
    </div>
  );
};

export default CommentSection;
