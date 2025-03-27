import Member from "./Member";
import TaskComment from "./TaskComment";

export const statusNames = ["ToDo", "InProgress", "Done"] as const;

export type Status = (typeof statusNames)[number];

export default interface Task {
  id: string;
  projectId: string;
  name: string;
  description: string;
  status: Status; // 상태
  managers: Member[]; // 담당자
  startDate: string; // 시작일
  endDate: string; // 마감일
  progress: number; // 진행률
  subTasks: Task[]; // 하위작업들
  priority?: boolean; // 우선순위
  comments: TaskComment[];
}
