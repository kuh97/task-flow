import { createContext, PropsWithChildren, useContext, useState } from "react";

interface TaskSelectContextType {
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;
  selectedSubTaskId: string | null;
  setSelectedSubTaskId: (id: string | null) => void;
}

const TaskSelectContext = createContext<TaskSelectContextType | null>(null);

export const TaskSelectProvider = ({ children }: PropsWithChildren) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedSubTaskId, setSelectedSubTaskId] = useState<string | null>(
    null
  );

  return (
    <TaskSelectContext.Provider
      value={{
        selectedTaskId,
        setSelectedTaskId,
        selectedSubTaskId,
        setSelectedSubTaskId,
      }}
    >
      {children}
    </TaskSelectContext.Provider>
  );
};

export const useTaskSelectContext = () => {
  const context = useContext(TaskSelectContext);
  if (!context) {
    throw new Error(
      "useTaskSelectContext must be used within TaskSelectProvider"
    );
  }
  return context;
};

export default TaskSelectProvider;
