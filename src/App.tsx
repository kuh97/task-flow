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
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<ProjectListPage />} />
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
  );
};

export default App;
