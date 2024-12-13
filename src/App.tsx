import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProjectListPage from "@pages/ProjectListPage";
import ProjectMainPage from "@pages/ProjectMainPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProjectListPage />} />
        <Route path="/project/:id" element={<ProjectMainPage />} />
      </Routes>
    </Router>
  );
}

export default App;
