import { create } from "zustand";

interface ProjectStore {
  projectId: string;
  setProjectId: (id: string) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projectId: "",
  setProjectId: (id) => set({ projectId: id }),
  clearProjectId: () => set({ projectId: "" }),
}));
