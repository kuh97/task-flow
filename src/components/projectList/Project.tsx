import { Link } from "react-router-dom";
import { ProjectBasic } from "@models/Project";
import CircularProgress from "@components/projectList/CircularProgress";
import KebabMenu from "../common/KebabMenu";
import { useState } from "react";
import Icon from "../common/icon/Icon";
import { DeleteProjectModalProps } from "@/types/modalTypes";
import { useAppStore } from "@/store/useAppStore";
import { useProjectMutations } from "@/hooks/project/useProjectMutation";

interface ProjectProps {
  project: ProjectBasic;
  onEdit: (project: ProjectBasic) => void;
}

/**
 * 프로젝트 컴포넌트입니다.
 */
const Project = ({ project, onEdit }: ProjectProps) => {
  const [isKebabMenuOpen, setIsKebabMenuOpen] = useState<boolean>(false);
  const { showModal, closeModal } = useAppStore();

  const handleDeleteProject = () => {
    deleteProject(project);
  };

  const handleCloseModal = () => {
    closeModal();
  };

  const { deleteProject } = useProjectMutations({
    onSuccess: handleCloseModal, // 성공 시 modal 닫기
  });

  const menuItems = [
    {
      label: "수정",
      onClick: () => {
        onEdit(project);
        setIsKebabMenuOpen(false);
      },
    },
    {
      label: "삭제",
      onClick: () => {
        showModal("deleteProject", {
          handleCloseModal,
          handleDeleteProject,
        } as DeleteProjectModalProps);
      },
    },
  ];

  const handleClickThreeDots = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsKebabMenuOpen(!isKebabMenuOpen);
  };

  return (
    <Link
      key={project.id}
      to={`/project/${project.id}/kanban`}
      className="flex cursor-pointer p-4 mb-2 bg-white rounded-md hover:bg-gray-200 shadow-sm"
    >
      <CircularProgress progress={project.progress} size={24} strokeWidth={5} />
      <div className="flex flex-col ml-4">
        <h4 className="font-semibold">{project.name}</h4>
        <p className="text-sm text-gray-600">{project.description}</p>
      </div>
      <div className="relative ml-auto">
        <button
          onClick={handleClickThreeDots}
          className="p-1 rounded cursor-pointer"
        >
          <Icon
            name={"threeDots"}
            className={"w-8 h-8 rounded-full hover:bg-gray rotate-90"}
          />
        </button>
        {isKebabMenuOpen && (
          <KebabMenu
            className="w-20"
            menuItems={menuItems}
            onClose={() => setIsKebabMenuOpen(false)}
          />
        )}
      </div>
    </Link>
  );
};

export default Project;
