import { CreateTaskModalProps } from "@/types/modalTypes";
import Modal from "../common/Modal";
import TaskForm, { FormData } from "../kanbanBoard/TaskForm";
import { useState } from "react";

/**
 * Task 생성 모달입니다.
 */
const CreateTaskModal = ({
  handleCloseModal,
  handleSubmit,
  initialFormData,
  errorMsg,
  clearFieldError,
  members,
}: CreateTaskModalProps) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const handleClick = () => {
    handleSubmit(formData);
  };

  return (
    <Modal
      title={"작업 추가"}
      isOpen={true}
      onClose={handleCloseModal}
      buttonLabel={"생성"}
      onClick={handleClick}
    >
      <TaskForm
        formData={formData}
        setFormData={setFormData}
        members={members}
        errorMsg={errorMsg}
        clearFieldError={clearFieldError}
      />
    </Modal>
  );
};

export default CreateTaskModal;
