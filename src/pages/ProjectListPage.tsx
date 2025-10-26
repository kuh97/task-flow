import Header from "@components/Header";
import ProjectList from "@components/projectList/ProjectList";
import {
  ErrorMessage,
  FormData,
} from "@/components/projectList/ProjectEditForm";
import { useState } from "react";
import { ProjectBasic } from "@models/Project";
import { format } from "date-fns";
import StatusBar from "@/components/StatusBar";
import { useProjectMutations } from "@/hooks/project/useProjectMutation";
import { useAppStore } from "@store/useAppStore";
import { ProjectEditModalProps } from "@/types/modalTypes";
import { convertToDateString } from "@/utils/convertDateFormat";

const ProjectListPage = () => {
  const [errorMsg, setErrorMsg] = useState<ErrorMessage>({});
  const { showModal, closeModal } = useAppStore();

  const handleCloseModal = () => {
    closeModal();
    setErrorMsg({});
  };

  const { createProject, updateProject } = useProjectMutations({
    onSuccess: handleCloseModal, // 성공 시 modal 닫기
  });

  const validationCheck = (data: FormData) => {
    const { name, description } = data;
    let hasError = false;
    if (!name || name.trim() === "") {
      setErrorMsg((prev) => ({
        ...prev,
        ["name"]: "프로젝트 이름을 입력해주세요",
      }));
      hasError = true;
    }
    if (!description || description.trim() === "") {
      setErrorMsg((prev) => ({
        ...prev,
        ["description"]: "프로젝트 설명을 입력해주세요",
      }));
      hasError = true;
    }

    if (hasError) return false;

    return true;
  };

  const handleCreateProject = (data: FormData) => {
    if (validationCheck(data)) {
      const { name, description, endDate } = data;
      const newProject: ProjectBasic = {
        id: "",
        name,
        description,
        createdAt: format(new Date(), "yyyy-MM-dd"),
        progress: 0,
        endDate: endDate ? new Date(endDate).getTime().toString() : "",
      };

      createProject(newProject);
    }
  };

  const handleShowCreateProjectModal = () => {
    const initialFormData: FormData = {
      name: "",
      description: "",
      endDate: "",
    };
    showModal("createProject", {
      handleCloseModal,
      handleSubmit: handleCreateProject,
      initialFormData,
      errorMsg,
      setErrorMsg,
    } as ProjectEditModalProps);
  };

  const handleUpdateProject = (data: FormData, project: ProjectBasic) => {
    if (validationCheck(data)) {
      const updatedProject: ProjectBasic = {
        ...project,
        ...data,
      };

      updateProject(updatedProject);
    }
  };

  const handleShowUpdateProjectModal = (project: ProjectBasic) => {
    const initialData: FormData = {
      name: project.name,
      description: project.description,
      endDate: project.endDate ? convertToDateString(project.endDate) : "",
    };

    showModal("updateProject", {
      handleCloseModal,
      handleSubmit: handleUpdateProject,
      initialFormData: initialData,
      errorMsg,
      setErrorMsg,
      project,
    } as ProjectEditModalProps);
  };

  return (
    <>
      <StatusBar hideGreeting />
      <div className="flex flex-col border-box h-screen mx-40 py-5">
        <Header
          title={"프로젝트"}
          buttonLabel={"프로젝트 생성"}
          onClick={handleShowCreateProjectModal}
        />
        <hr className="mt-4 border-t-2" />
        <ProjectList onEdit={handleShowUpdateProjectModal} />
      </div>
    </>
  );
};

export default ProjectListPage;
