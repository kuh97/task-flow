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

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route index element={<ProjectListPage />} />
          <Route element={<Layout />}>
            <Route
              path="/project/:id"
              element={<Navigate to="kanban" replace />}
            />
            <Route path="/project/:id/kanban" element={<KanbanBoardPage />} />
            <Route path="/project/:id/gantt" element={<GanttChartPage />} />
            <Route path="/project/:id/members" element={<MembersPage />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
