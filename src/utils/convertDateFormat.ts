import { format } from "date-fns";

export const convertToDateString = (
  timestamp: string | undefined
): string | undefined => {
  if (!timestamp) return undefined;
  return format(new Date(parseInt(timestamp)), "yyyy-MM-dd");
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
