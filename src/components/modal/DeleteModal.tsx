import { DeleteModalProps } from "@/types/modalTypes";
import Modal from "../common/Modal";

/**
 * 작업 삭제 모달입니다.
 */
const DeleteModal = ({
  title,
  description,
  handleCloseModal,
  handleDelete,
}: DeleteModalProps) => {
  return (
    <Modal
      title={title}
      isOpen={true}
      onClose={handleCloseModal}
      buttonLabel={"삭제"}
      onClick={handleDelete}
      className="whitespace-pre-line"
    >
      {description}
    </Modal>
  );
};

export default DeleteModal;
