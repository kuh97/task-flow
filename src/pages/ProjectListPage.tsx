import Header from "@components/sections/Header";
import ProjectList from "@components/projectList/ProjectList";
import { useProjectStore } from "@store/useProjectStore";
import { useNavigate } from "react-router-dom";
import Modal from "@/components/common/Modal";
import CreateProjectForm, {
  ErrorMessage,
  FormData,
} from "@/components/projectList/CreateProjectForm";
import { useState } from "react";
import Project from "@models/Project";
import { format } from "date-fns";

function ProjectListPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({});
  const [errorMsg, setErrorMsg] = useState<ErrorMessage>({});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handleCloseModal = () => setIsModalOpen(false);

  const addProject = useProjectStore((state) => state.addProject);

  const validationCheck = () => {
    const { name, description } = formData;
    let hasError = false;
    if (!name || name.trim() === "") {
      setErrorMsg((prev) => ({
        ...prev,
        ["name"]: "프로젝트 이름을 입력해주세요.",
      }));
      hasError = true;
    }
    if (!description || description.trim() === "") {
      setErrorMsg((prev) => ({
        ...prev,
        ["description"]: "프로젝트 설명을 입력해주세요.",
      }));
      hasError = true;
    }

    if (hasError) return false;

    return true;
  };

  const handleCreateProject = () => {
    if (validationCheck()) {
      const newProject: Project = {
        id: Date.now(), // 임시 ID 생성
        name: formData.name,
        description: formData.description,
        createdAt: format(new Date(), "yyyy-MM-dd"),
        progress: 0,
        members: [],
        endDate: formData.endDate ?? "",
        tasks: [],
      };
      // store에 프로젝트 추가
      addProject(newProject);

      setIsModalOpen(false);
      // 새로 생성된 프로젝트의 칸반보드로 이동
      navigate(`/project/${newProject.id}/kanban`);
    }
  };

  return (
    <div className="box-border h-screen mx-40 py-10">
      <Header
        title={"프로젝트"}
        buttonLabel={"프로젝트 생성"}
        onClick={() => setIsModalOpen(true)}
      />
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
}

export default ProjectListPage;
