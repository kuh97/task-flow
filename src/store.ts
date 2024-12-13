// 예시 코드
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { TotalCount } from "./types";

interface TotalStore extends TotalCount {
  loading: boolean;
  getTotalCount: () => Promise<void>;
}

export const totalStore = create<TotalStore>()(
  devtools(
    (set) => ({
      totalCount: 0,
      loading: false,
      setTotalCount: (count) => set({ totalCount: count }),
      getTotalCount: async () => {
        set({ loading: true });
        try {
          // 여기에 실제 API 호출 코드를 작성하기
          const response = await fetch("/api/totalCount");
          const data = await response.json();
          set({ totalCount: data.count });
        } catch (error) {
          console.error("total count:", error);
        } finally {
          set({ loading: false });
        }
      },
    }),
    { name: "totalStore" }
  )
);
