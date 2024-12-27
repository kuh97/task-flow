import { createContext, PropsWithChildren, useContext, useState } from "react";

interface DragContextProps {
  draggedTaskId: number;
  setDraggedTaskId: (taskId: number) => void;
}

const TaskCardDragContext = createContext<DragContextProps | undefined>(
  undefined
);

export const TaskCardDragProvider = ({ children }: PropsWithChildren) => {
  const [draggedTaskId, setDraggedTaskId] = useState<number>(-1);

  return (
    <TaskCardDragContext.Provider value={{ draggedTaskId, setDraggedTaskId }}>
      {children}
    </TaskCardDragContext.Provider>
  );
};

export const useTaskCardDragContext = () => {
  const context = useContext(TaskCardDragContext);
  if (!context) {
    throw new Error(
      "useTaskCardDragContext must be used within a TaskCardDragProvider"
    );
  }
  return context;
};

export default TaskCardDragProvider;
