import Member from "./Member";
import Task from "./Task";

export interface ProjectBasic {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  endDate?: string;
  progress: number;
}

export default interface Project extends ProjectBasic {
  members: Member[]; // 구성원
  tasks: Task[]; // 작업들
}
