import Task from "@models/Task";

export interface GanttChartTask extends Task {
  parent?: string;
}

export const flattenTasksForGanttChart = (tasks: Task[]) => {
  const processTask = (task: Task) => {
    const flattenSubTasks = task.subTasks.map((subTask) => {
      return {
        ...subTask,
        parent: task.id,
      };
    });
    return [task, ...flattenSubTasks];
  };

  const flatTasks: GanttChartTask[] = [];
  tasks.forEach((task) => flatTasks.push(...processTask(task)));
  return flatTasks;
};
