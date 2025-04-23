import { useState } from "react";
import { Status, statusNames } from "@models/Task";
import Board from "@components/kanbanBoard/Board";
import TaskCardDragProvider from "@/context/TaskCardDragContext";
import Header from "@components/Header";
import Modal from "@components/common/Modal";
import TaskForm, { FormData } from "@/components/kanbanBoard/TaskForm";
import { useProjectData } from "@/hooks/project/useProjectMutation";
import { TaskInput, useTaskMutations } from "@/hooks/task/useTaskMutation";
import { useTaskValidation } from "@/hooks/task/useTaskValidation";
import { useProjectStore } from "@/store/useProjectStore";

const KanbanBoardPage = () => {
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
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { errorMsg, resetErrors, validationCheck, clearFieldError } =
    useTaskValidation();

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(initialFormData);
    resetErrors();
  };

  const handleCreateTask = () => {
    if (validationCheck(formData)) {
      const newTask: TaskInput = {
        id: "",
        projectId: project.id,
        name: formData.name,
        description: formData.description ?? "",
        status: formData.status,
        managers: formData.managers.map((member) => member.id) ?? [],
        startDate: formData.startDate ?? "",
        endDate: formData.endDate ?? "",
        progress: 0,
        priority: false,
      };

      createTask(newTask);
      handleCloseModal();
    }
  };

  return (
    <div className="flex flex-col p-5 px-12 border-box h-full">
      <Header
        title="칸반 보드"
        buttonLabel="작업 추가"
        onClick={() => setIsModalOpen(true)}
      />
      <TaskCardDragProvider>
        <div className="flex border-box space-x-4 mt-6 h-screen overflow-hidden">
          {statusNames.map((status) => (
            <Board key={status} taskType={status} project={project} />
          ))}
        </div>
      </TaskCardDragProvider>
      <Modal
        title={"작업 추가"}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        buttonLabel={"생성"}
        onClick={handleCreateTask}
      >
        <TaskForm
          formData={formData}
          setFormData={setFormData}
          members={project.members}
          errorMsg={errorMsg}
          clearFieldError={clearFieldError}
        />
      </Modal>
    </div>
  );
};

export default KanbanBoardPage;
