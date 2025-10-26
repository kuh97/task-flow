import { DeleteProjectModalProps } from "@/types/modalTypes";
import Modal from "../common/Modal";

/**
 * 프로젝트 삭제 모달입니다.
 */
const DeleteProjectModal = ({
  handleCloseModal,
  handleDeleteProject,
}: DeleteProjectModalProps) => {
  return (
    <Modal
      title={"프로젝트 삭제"}
      isOpen={true}
      onClose={handleCloseModal}
      buttonLabel={"삭제"}
      onClick={handleDeleteProject}
    >
      {"프로젝트를 정말 삭제하시겠습니까?"}
    </Modal>
  );
};

export default DeleteProjectModal;
