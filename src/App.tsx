import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./queryClient";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProjectListPage from "@pages/ProjectListPage";
import Layout from "@components/Layout";
import KanbanBoardPage from "@pages/KanbanBoardPage";
import GanttChartPage from "@pages/GanttChartPage";
import MembersPage from "@pages/MembersPage";
import LoginPage from "@pages/LoginPage";
import ProtectedRoute from "@components/ProtectedRoute";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useAuthStore } from "@store/authStore";
import { useEffect } from "react";
import { getAuthToken, setAuthToken } from "./api/graphqlClient";

const App = () => {
  useEffect(() => {
    const token = getAuthToken();

    if (token) {
      setAuthToken(token);
    } else {
      useAuthStore.getState().initializeAuth();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<ProjectListPage />} />
            <Route element={<Layout />}>
              <Route path="/project/:id" element={<KanbanBoardPage />} />
              <Route path="/project/:id/kanban" element={<KanbanBoardPage />} />
              <Route path="/project/:id/gantt" element={<GanttChartPage />} />
              <Route path="/project/:id/members" element={<MembersPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
