import Header from "@components/Header";
import ProjectList from "@components/projectList/ProjectList";
import { useNavigate } from "react-router-dom";
import Modal from "@/components/common/Modal";
import CreateProjectForm, {
  ErrorMessage,
  FormData,
} from "@/components/projectList/CreateProjectForm";
import { useState } from "react";
import { ProjectBasic } from "@models/Project";
import { format } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import { createProject } from "@api/projectApi";
import queryClient from "@/queryClient";

const ProjectListPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({});
  const [errorMsg, setErrorMsg] = useState<ErrorMessage>({});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({});
    setErrorMsg({});
  };

  const validationCheck = () => {
    const { name, description } = formData;
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

  const { mutate } = useMutation<ProjectBasic, Error, ProjectBasic>({
    mutationFn: (newProject: ProjectBasic) => createProject(newProject),
    onSuccess: (data) => {
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      handleCloseModal();
      navigate(`/project/${data.id}/kanban`);
    },
    onError: (error) => {
      console.error("프로젝트 생성 실패:", error);
    },
  });

  const handleCreateProject = () => {
    if (validationCheck()) {
      const newProject: ProjectBasic = {
        id: "",
        name: formData.name,
        description: formData.description,
        createdAt: format(new Date(), "yyyy-MM-dd"),
        progress: 0,
        endDate: formData.endDate
          ? new Date(formData.endDate).getTime().toString()
          : "",
      };

      mutate(newProject);
    }
  };

  return (
    <div className="flex flex-col border-box h-screen mx-40 py-10">
      <Header
        title={"프로젝트"}
        buttonLabel={"프로젝트 생성"}
        onClick={() => setIsModalOpen(true)}
      />
      <hr className="mt-4 border-t-2" />
      <ProjectList />
      <Modal
        title={"프로젝트 생성"}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        buttonLabel={"생성"}
        onClick={handleCreateProject}
      >
        <CreateProjectForm
          setFormData={setFormData}
          errorMessages={errorMsg}
          setErrorMsg={setErrorMsg}
        />
      </Modal>
    </div>
  );
};

export default ProjectListPage;
