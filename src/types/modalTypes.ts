import {
  ErrorMessage as ProjectErrorMessage,
  FormData as ProjectFormData,
} from "@/components/projectList/ProjectEditForm";
import {
  ErrorMessage as TaskErrorMessage,
  FormData as TaskFormData,
} from "@/components/kanbanBoard/TaskForm";
import { ProjectBasic } from "@/models/Project";
import Member from "@/models/Member";

/**
 * 프로젝트 생성
 */
export interface ProjectEditModalProps {
  mode: "create" | "update";
  handleCloseModal: () => void;
  handleSubmit: (data: ProjectFormData, project?: ProjectBasic) => void;
  initialFormData: ProjectFormData;
  errorMsg: ProjectErrorMessage;
  setErrorMsg: React.Dispatch<React.SetStateAction<ProjectErrorMessage>>;
  project?: ProjectBasic; // update 모드일 때만 필요
}

/**
 * 프로젝트 삭제
 */
export interface DeleteProjectModalProps {
  handleCloseModal: () => void;
  handleDeleteProject: () => void;
}

/**
 * Task 생성
 */
export interface CreateTaskModalProps {
  handleCloseModal: () => void;
  handleSubmit: (data: TaskFormData) => void;
  initialFormData: TaskFormData;
  errorMsg: TaskErrorMessage;
  clearFieldError: (field: string) => void;
  members: Member[];
}

/**
 * Task 삭제
 */

export interface DeleteModalProps {
  title: string;
  description: string;
  handleCloseModal: () => void;
  handleDelete: () => void;
}
