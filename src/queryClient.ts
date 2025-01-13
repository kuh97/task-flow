import { QueryClient } from "@tanstack/react-query";

// QueryClient 인스턴스 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3, // 실패 시 3번 재시도
      refetchOnWindowFocus: false, // 창 포커스 시 리패치 방지
      staleTime: 1000 * 60 * 5, // 데이터가 5분간 신선한 상태로 유지
    },
  },
});

export default queryClient;
