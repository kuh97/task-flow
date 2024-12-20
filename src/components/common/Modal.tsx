import { PropsWithChildren } from "react";
import CloseButtonIcon from "@components/common/CloseButtonIcon";

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  buttonLabel: string;
  onClick: () => void;
}

function Modal({
  title,
  isOpen,
  onClose,
  buttonLabel,
  onClick,
  children,
}: PropsWithChildren<ModalProps>) {
  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="flex flex-col bg-white p-6 rounded-lg min-w-fit">
        <div className="w-full flex justify-between">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button onClick={onClose}>
            <CloseButtonIcon />
          </button>
        </div>
        {children}
        <button
          className="mt-6 ml-auto bg-primary text-white hover:bg-primary-hover px-4 py-1 rounded"
          onClick={onClick}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  ) : null;
}

export default Modal;
