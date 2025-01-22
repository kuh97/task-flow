import { Status } from "@models/Task";

export const STATUS_TITLES: Record<Status, string> = {
  ToDo: "작업 예정",
  InProgress: "작업 중",
  Done: "작업 완료",
};
