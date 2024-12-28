import { useState } from "react";
import Icon from "@components/common/Icon";
import Project from "@models/Project";
import { useNavigate } from "react-router-dom";

interface Menu {
  id: number;
  name: string;
  imageName: string;
  showName?: boolean;
}

const menus: Menu[] = [
  { id: 1, name: "홈으로", imageName: "home", showName: false },
  { id: 2, name: "칸반 보드", imageName: "kanban", showName: true },
  { id: 3, name: "간트 차트", imageName: "gantt", showName: true },
  { id: 4, name: "구성원 관리", imageName: "members", showName: true },
];

interface LeftToolPaneProps {
  project: Project;
}

const LeftToolPane = ({ project }: LeftToolPaneProps) => {
  const navigate = useNavigate();
  const [selectedTool, setSelectedTool] = useState<number | null>(2);

  const handleMenuClick = (menuId: number) => {
    setSelectedTool(menuId);
    switch (menuId) {
      case 1:
        navigate("/");
        break;
      case 2:
        navigate(`/project/${project.id}/kanban`);
        break;
      case 3:
        navigate(`/project/${project.id}/gantt`);
        break;
      case 4:
        navigate(`/project/${project.id}/members`);
        break;
    }
  };

  return (
    <div className="fixed left-0 top-0 w-64 h-screen bg-white border-r">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{project.name}</h1>
        </div>
        <div className="space-y-3">
          {menus.map((menu) => (
            <button
              key={menu.id}
              className={`w-full p-4 text-left rounded-lg 
                ${menu.id === selectedTool ? "border-2 border-blue-500 bg-blue-50" : "border-2 border-transparent bg-slate-50"} 
                hover:border-blue-500 hover:bg-blue-50
                transition-all duration-200`}
              onClick={() => handleMenuClick(menu.id)}
            >
              <div
                className={`flex items-center ${menu.showName ? "w-full" : "justify-center"}`}
              >
                <Icon
                  name={menu.imageName}
                  alt={`${menu.imageName}_${menu.id}`}
                  className={`${menu.id === 1 ? "w-8 h-8" : "w-6 h-6 mr-3"} 
                    ${menu.id === selectedTool ? "text-blue-500" : "text-gray-700"}`}
                />
                {menu.showName && (
                  <span
                    className={`font-medium ${menu.id === selectedTool ? "text-blue-500" : "text-gray-700"}`}
                  >
                    {menu.name}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeftToolPane;
