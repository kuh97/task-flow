import { ProjectEditModalProps } from "@/types/modalTypes";
import Modal from "../common/Modal";
import ProjectEditForm, { FormData } from "./ProjectEditForm";
import { useState } from "react";

/**
 * 프로젝트 생성/수정용 모달입니다.
 */
const ProjectEditModal = ({
  mode,
  handleCloseModal,
  handleSubmit,
  initialFormData,
  errorMsg,
  setErrorMsg,
  project,
}: ProjectEditModalProps) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const title = mode === "create" ? "프로젝트 생성" : "프로젝트 수정";
  const buttonLabel = mode === "create" ? "생성" : "수정";
  const handleClick = () => {
    handleSubmit(formData, project);
  };

  return (
    <Modal
      title={title}
      isOpen={true}
      onClose={handleCloseModal}
      buttonLabel={buttonLabel}
      onClick={handleClick}
    >
      <ProjectEditForm
        initialFormData={initialFormData}
        setFormData={setFormData}
        errorMessages={errorMsg}
        setErrorMsg={setErrorMsg}
      />
    </Modal>
  );
};

export default ProjectEditModal;
