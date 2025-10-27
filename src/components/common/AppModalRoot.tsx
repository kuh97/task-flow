import { useAppStore } from "@store/useAppStore";
import ProjectEditModal from "@components/modal/ProjectEditModal";
import {
  ProjectEditModalProps,
  DeleteProjectModalProps,
  CreateTaskModalProps,
  DeleteModalProps,
} from "@/types/modalTypes";
import DeleteProjectModal from "../modal/DeleteProjectModal";
import CreateTaskModal from "../modal/CreateTaskModal";
import DeleteModal from "../modal/DeleteModal";

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
    case "createTask":
      return <CreateTaskModal {...(modalProps as CreateTaskModalProps)} />;
    case "delete":
      return <DeleteModal {...(modalProps as DeleteModalProps)} />;
    default:
      return null;
  }
};

export default AppModalRoot;
