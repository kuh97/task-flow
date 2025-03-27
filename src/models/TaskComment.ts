import Member from "./Member";

export default interface TaskComment {
  id: string;
  projectId: string;
  taskId: string;
  member: Member;
  author?: string; // 클라이언트용. 멤버 닉네임
  content: string;
  createdAt: string;
  updatedAt: string;
  expiredAt: string;
  likeCount: number;
  isClicked: boolean /** 로그인한 유저의 클릭 여부 */;
}
