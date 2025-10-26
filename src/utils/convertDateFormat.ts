import { format, formatDistanceToNow, fromUnixTime } from "date-fns";
import { ko } from "date-fns/locale";

export const convertToDateString = (
  timestamp: string | undefined,
  dateFormat: string = "yyyy-MM-dd"
): string => {
  if (!timestamp) return "";
  return format(fromUnixTime(parseInt(timestamp) / 1000), dateFormat);
};

export const convertTaskDates = (task: any) => {
  return {
    ...task,
    startDate: convertToDateString(task.startDate),
    endDate: convertToDateString(task.endDate),
    subTasks: task.subTasks?.map(convertTaskDates),
  };
};

export const convertProjectDates = (project: any) => {
  return {
    ...project,
    createdAt: convertToDateString(project.createdAt),
    endDate: convertToDateString(project.endDate),
    tasks: project.tasks?.map(convertTaskDates),
  };
};

export const getTimeAgo = (timestamp: string) => {
  const date = fromUnixTime(parseInt(timestamp) / 1000);
  const now = new Date();

  // 하루 전인지 확인
  const isYesterday =
    new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() -
      date.getTime() >
    86400000;

  // 하루가 지난 경우
  if (isYesterday) {
    return format(date, "yyyy-MM-dd", { locale: ko });
  }

  // 그 외에는 몇 분 전, 몇 시간 전으로 반환
  return formatDistanceToNow(date, { addSuffix: true, locale: ko });
};
