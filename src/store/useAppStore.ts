import Member from "@/models/Member";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AppStore {
  loginMember: Member | null;
  setLoginMember: (member: Member | null) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      loginMember: null,
      setLoginMember: (member) => set({ loginMember: member }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
