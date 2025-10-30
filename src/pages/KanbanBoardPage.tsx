import { Status, statusNames } from "@models/Task";
import Board from "@components/kanbanBoard/Board";
import TaskCardDragProvider from "@/context/TaskCardDragContext";
import Header from "@components/Header";
import { FormData } from "@/components/kanbanBoard/TaskForm";
import { useProjectData } from "@/hooks/project/useProjectMutation";
import { TaskInput, useTaskMutations } from "@/hooks/task/useTaskMutation";
import { useTaskValidation } from "@/hooks/task/useTaskValidation";
import { useProjectStore } from "@/store/useProjectStore";
import { useAppStore } from "@/store/useAppStore";

const KanbanBoardPage = () => {
  const { showModal, closeModal } = useAppStore();
  const { projectId } = useProjectStore();
  const { data: project } = useProjectData(projectId);
  if (project == null) {
    return null;
  }

  const { createTask } = useTaskMutations({ projectId: project.id });

  const initialFormData = {
    name: "",
    description: "",
    status: "ToDo" as Status,
    managers: [],
    startDate: "",
    endDate: "",
  };
  const { errorMsg, resetErrors, validationCheck, clearFieldError } =
    useTaskValidation();

  const handleCloseModal = () => {
    resetErrors();
  };

  const handleCreateTask = (data: FormData) => {
    if (validationCheck(data)) {
      const newTask: TaskInput = {
        id: "",
        projectId: project.id,
        name: data.name,
        description: data.description ?? "",
        status: data.status,
        managers: data.managers.map((member) => member.id) ?? [],
        startDate: data.startDate ?? "",
        endDate: data.endDate ?? "",
        progress: 0,
        priority: false,
      };

      createTask(newTask);
      handleCloseModal();
      closeModal();
    }
  };

  const handleShowCreateTaskModal = () => {
    showModal("createTask", {
      handleCloseModal: () => closeModal(),
      handleSubmit: handleCreateTask,
      initialFormData,
      errorMsg,
      clearFieldError,
      members: project.members,
    });
  };

  return (
    <div className="flex flex-col p-5 px-12 border-box h-full">
      <Header
        title="칸반 보드"
        buttonLabel="작업 추가"
        onClick={handleShowCreateTaskModal}
      />
      <TaskCardDragProvider>
        <div className="flex border-box space-x-4 mt-6 h-screen overflow-hidden">
          {statusNames.map((status) => (
            <Board key={status} taskType={status} project={project} />
          ))}
        </div>
      </TaskCardDragProvider>
    </div>
  );
};

export default KanbanBoardPage;
