import Member from "@/models/Member";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  ProjectEditModalProps,
  DeleteProjectModalProps,
  CreateTaskModalProps,
  DeleteModalProps,
} from "@/types/modalTypes";

type ModalType =
  | "createProject"
  | "updateProject"
  | "deleteProject"
  | "createTask"
  | "delete"
  | null;

type ModalProp =
  | ProjectEditModalProps
  | DeleteProjectModalProps
  | CreateTaskModalProps
  | DeleteModalProps
  | null;

interface AppStore {
  loginMember: Member | null;
  setLoginMember: (member: Member | null) => void;

  openModal: boolean;
  modalType: ModalType;
  modalProps: ModalProp;
  showModal: (type: Exclude<ModalType, null>, props: ModalProp) => void;
  closeModal: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      loginMember: null,
      setLoginMember: (member) => set({ loginMember: member }),

      openModal: false,
      modalType: null,
      modalProps: null,

      showModal: (type, props) =>
        set({ openModal: true, modalType: type, modalProps: props }),
      closeModal: () =>
        set({ openModal: false, modalType: null, modalProps: null }),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => sessionStorage),

      // login정보만 저장하고 나머지 모달 관련 상태는 제외
      partialize: (state) => ({
        loginMember: state.loginMember,
      }),
    },
  ),
);
