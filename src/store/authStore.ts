import { create } from "zustand";
import { getAuthToken, removeAuthToken } from "../api/graphqlClient";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthState = {
  isAuth: boolean;
  initializeAuth: () => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuth: false,
      initializeAuth: () => {
        try {
          const token = getAuthToken();
          set({ isAuth: !!token });
        } catch (error) {
          set({ isAuth: false });
        }
      },
      logout: () => {
        removeAuthToken();
        set({ isAuth: false });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
