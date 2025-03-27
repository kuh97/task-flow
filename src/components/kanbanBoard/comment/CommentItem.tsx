import { useAppStore } from "@/store/useAppStore";
import TaskComment from "@models/TaskComment";
import { UseMutateFunction } from "@tanstack/react-query";
import { getTimeAgo } from "@utils/convertDateFormat";
import { useEffect, useState } from "react";

interface CommentItemProps {
  comment: TaskComment;
  updateComment: UseMutateFunction<
    { updateComment: TaskComment },
    Error,
    { commentId: string; content: string },
    unknown
  >;
  deleteComment: UseMutateFunction<
    {
      deleteComment: TaskComment;
    },
    Error,
    {
      commentId: string;
    },
    unknown
  >;
  toggleLikeComment: UseMutateFunction<
    TaskComment,
    Error,
    { commentId: string; isLike: boolean },
    unknown
  >;
}

const CommentItem = ({
  comment,
  updateComment,
  deleteComment,
  toggleLikeComment,
}: CommentItemProps) => {
  // 로그인 정보 가져오기
  const { loginMember } = useAppStore();

  const [like, setLike] = useState<boolean>(comment.isClicked);
  const [onEdit, setOnEdit] = useState<boolean>(false);
  const [editCommentText, setEditCommentText] = useState<string>(
    comment.content
  );

  const handleLike = (id: string) => {
    const toggle = !like;
    setLike(toggle);
    toggleLikeComment({ commentId: id, isLike: toggle });
  };

  const handleDelete = (id: string) => {
    deleteComment({ commentId: id });
  };

  const handleSaveEdit = (id: string, newText: string) => {
    setOnEdit(false);
    updateComment({ commentId: id, content: newText });
  };

  useEffect(() => {
    setEditCommentText(comment.content);
  }, [onEdit]);

  return (
    <div key={comment.id} className="p-2">
      <div className="flex items-center justify-between space-x-2">
        <span className="font-bold text-sm">{comment.member.nickname}</span>
        <div>
          {comment.updatedAt && (
            <span className="mr-2 text-xs text-gray-400">수정됨</span>
          )}
          <span className="text-xs text-gray-400">
            {getTimeAgo(comment.createdAt)}
          </span>
        </div>
      </div>
      {onEdit ? (
        <div className="flex flex-col mt-2">
          <textarea
            className="w-full p-2 text-sm border rounded-md resize-none"
            value={editCommentText}
            onChange={(e) => setEditCommentText(e.target.value)}
          />
          <div className="ml-auto mt-1">
            <button
              className="w-[60px] px-2 py-2 box-border bg-gray-light text-sm rounded-md hover:bg-gray"
              onClick={() => setOnEdit(false)}
            >
              취소
            </button>
            <button
              className="w-[60px] px-2 py-2 ml-2 box-border bg-primary text-white text-sm rounded-md hover:bg-primary-hover"
              onClick={() => handleSaveEdit(comment.id, editCommentText)}
            >
              저장
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-2 text-sm text-gray-800">{comment.content}</p>
      )}
      <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600">
        <button
          onClick={() => handleLike(comment.id)}
          className={`flex items-center space-x-1 rounded-full px-2 pt-[1px] pb-[3px] hover:text-primary ${like ? "border border-primary bg-indigo-100/80 text-primary" : ""}`}
        >
          <span>👍</span>
          <span>{comment.likeCount}</span>
        </button>

        {!onEdit && comment.member.id === loginMember?.id && (
          <>
            <button
              onClick={() => setOnEdit(true)}
              className="hover:text-gray-500"
            >
              수정
            </button>

            <button
              onClick={() => handleDelete(comment.id)}
              className="hover:text-red-500"
            >
              삭제
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
