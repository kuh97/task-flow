import { useParams } from "react-router-dom";
import { useProjectStore } from "@store/useProjectStore";
import { Status, statusNames } from "@/models/Task";
import Board from "@components/kanbanBoard/Board";
import TaskCardDragProvider from "@/context/TaskCardDragContext";
import Header from "@/components/sections/Header";
import Modal from "@/components/common/Modal";
import { useState } from "react";
import CreateTaskForm, {
  ErrorMessage,
  FormData,
} from "@/components/kanbanBoard/CreateTaskForm";
import Task from "@/models/Task";

const KanbanBoardPage = () => {
  const { id } = useParams<{ id: string }>();
  const { projects, addTask } = useProjectStore();
  const project = projects.find((p) => p.id === Number(id));

  const initialFormData = {
    name: "",
    description: "",
    status: "ToDo" as Status,
    managers: [],
    startDate: "",
    endDate: "",
  };
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errorMsg, setErrorMsg] = useState<ErrorMessage>({});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  if (!project) {
    return <div>프로젝트를 찾을 수 없습니다.</div>;
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(initialFormData);
    setErrorMsg({});
  };

  const validationCheck = () => {
    const { name, startDate, endDate } = formData;
    let hasError = false;
    if (!name || name.trim() === "") {
      setErrorMsg((prev) => ({
        ...prev,
        ["name"]: "제목을 입력해주세요",
      }));
      hasError = true;
    }

    let dateErrorMsg = "";
    if (!startDate || startDate.trim() === "") {
      dateErrorMsg += "시작일";
    }
    if (!endDate || endDate.trim() === "") {
      if (dateErrorMsg !== "") {
        dateErrorMsg += "/마감일을 선택해주세요";
      } else {
        dateErrorMsg += "마감일을 선택해주세요";
      }
    }
    if (dateErrorMsg !== "") {
      setErrorMsg((prev) => ({
        ...prev,
        ["date"]: dateErrorMsg,
      }));
      hasError = true;
    }

    if (hasError) return false;

    return true;
  };

  const handleCreateTask = () => {
    if (validationCheck()) {
      const newTask: Task = {
        id: Date.now(),
        projectId: project.id,
        name: formData.name,
        description: formData.description ?? "",
        status: formData.status,
        managers: formData.managers ?? [],
        startDate: formData.startDate ?? "",
        endDate: formData.endDate ?? "",
        progress: 0,
        subTasks: [],
        priority: false,
      };

      addTask(project.id, newTask);
      handleCloseModal();
    }
  };

  return (
    <div className="flex flex-col ml-[250px] p-5 px-12 border-box h-full">
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
        <CreateTaskForm
          setFormData={setFormData}
          errorMessages={errorMsg}
          setErrorMsg={setErrorMsg}
          members={project.members}
        />
      </Modal>
    </div>
  );
};

export default KanbanBoardPage;
