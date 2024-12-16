import Member from "./Member";
import Task from "./Task";

export default interface Project {
  id: number;
  name: string;
  description: string;
  createdAt: string; // 생성일자
  progress: number; // 진행률
  members: Member[]; // 구성원
  endDate?: string; // 마감일
  tasks: Task[]; // 작업들
}
