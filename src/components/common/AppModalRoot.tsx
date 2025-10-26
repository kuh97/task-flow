import { useAppStore } from "@store/useAppStore";
import ProjectEditModal from "@components/projectList/ProjectEditModal";
import {
  ProjectEditModalProps,
  DeleteProjectModalProps,
} from "@/types/modalTypes";
import DeleteProjectModal from "../projectList/DeleteProjectModal";

const AppModalRoot = () => {
  const { openModal, modalType, modalProps } = useAppStore();

  if (!openModal || !modalType) return null;

  switch (modalType) {
    case "createProject":
      return (
        <ProjectEditModal
          {...(modalProps as Omit<ProjectEditModalProps, "mode">)}
          mode="create"
        />
      );
    case "updateProject":
      return (
        <ProjectEditModal
          {...(modalProps as Omit<ProjectEditModalProps, "mode">)}
          mode="update"
        />
      );
    case "deleteProject":
      return (
        <DeleteProjectModal {...(modalProps as DeleteProjectModalProps)} />
      );
    default:
      return null;
  }
};

export default AppModalRoot;
