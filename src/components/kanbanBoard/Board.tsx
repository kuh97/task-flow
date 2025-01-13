import Task, { Status } from "@models/Task";
import Project from "@models/Project";
import BoardHeader from "@components/kanbanBoard/BoardHeader";
import BoardContent from "@components/kanbanBoard/BoardContent";
import { useMutation } from "@tanstack/react-query";
import { updateTaskStatus } from "@api/taskApi";
import queryClient from "@/queryClient";

interface BoardProps {
  taskType: Status;
  project: Project;
}

const titleRecord: Record<Status, string> = {
  ToDo: "작업 예정",
  InProgress: "작업 중",
  Done: "작업 완료",
};

const Board = ({ taskType, project }: BoardProps) => {
  const { mutate } = useMutation<
    Task, // mutationFn 결과 타입
    Error, // 에러 타입
    Pick<Task, "id" | "status">, // 변수를 넘길 타입
    { previousProject: { getProjectById: Project } | undefined } // context 타입
  >({
    mutationFn: ({ id, status }) => updateTaskStatus(id, status),
    onMutate: async ({ id, status }) => {
      // 진행중인 refetch가 있다면 취소시킨다.
      await queryClient.cancelQueries({ queryKey: ["project", project.id] });

      // 이전 쿼리값의 스냅샷을 명시적으로 Project 타입으로 받음
      const getProjectById = queryClient.getQueryData<{
        getProjectById: Project;
      }>(["project", project.id]);

      if (getProjectById) {
        const { getProjectById: previousProject } = getProjectById;
        // setQueryData 함수를 사용해 Optimistic Update를 실시한다.
        queryClient.setQueryData(["project", project.id], {
          getProjectById: {
            ...previousProject,
            tasks: previousProject.tasks.map((task) =>
              task.id === id ? { ...task, status } : task
            ),
          },
        });
      }

      // 롤백을 위한 이전 상태 반환
      return { previousProject: getProjectById };
    },
    onSettled: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: ["project", project.id] });
    },
    onError: (err, variables, context) => {
      if (context?.previousProject) {
        // 에러 발생 시 이전 상태로 롤백
        queryClient.setQueryData(
          ["project", project.id],
          context.previousProject
        );
      }
    },
  });

  const handleUpdateTask = (targetTaskId: string, newStatus: Status) => {
    mutate({
      id: targetTaskId,
      status: newStatus,
    });
  };

  const filteredTask = project.tasks.filter((task) => task.status === taskType);
  return (
    <div className="flex flex-col w-[300px] h-full box-border rounded-lg bg-indigo-100/35 not:first-of-type:ml-6">
      <BoardHeader
        title={titleRecord[taskType]}
        taskCount={filteredTask.length}
      />
      <BoardContent
        type={taskType}
        tasks={filteredTask}
        handleUpdateTask={handleUpdateTask}
      />
    </div>
  );
};

export default Board;
