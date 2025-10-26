import {
  ErrorMessage,
  FormData,
} from "@/components/projectList/ProjectEditForm";
import { ProjectBasic } from "@/models/Project";

/**
 * 프로젝트 생성
 */
export interface ProjectEditModalProps {
  mode: "create" | "update";
  handleCloseModal: () => void;
  handleSubmit: (data: FormData, project?: ProjectBasic) => void;
  initialFormData: FormData;
  errorMsg: ErrorMessage;
  setErrorMsg: React.Dispatch<React.SetStateAction<ErrorMessage>>;
  project?: ProjectBasic; // update 모드일 때만 필요
}

/**
 * 프로젝트 삭제
 */
export interface DeleteProjectModalProps {
  handleCloseModal: () => void;
  handleDeleteProject: () => void;
}
