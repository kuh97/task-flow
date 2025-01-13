import { useTaskCardDragContext } from "@/context/TaskCardDragContext";
import Task, { Status } from "@/models/Task";
import { useState } from "react";
import TaskCard from "@components/kanbanBoard/card/TaskCard";

interface BoardContentProps {
  type: Status;
  tasks: Task[];
  handleUpdateTask: (targetTaskId: string, newStatus: Status) => void;
}

const BoardContent = ({ type, tasks, handleUpdateTask }: BoardContentProps) => {
  const [dragEntered, setDragEntered] = useState<boolean>(false);
  const { draggedTaskId } = useTaskCardDragContext();

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (
      draggedTaskId !== "" &&
      !tasks.some((task) => task.id === draggedTaskId)
    ) {
      setDragEntered(true);
      e.dataTransfer.dropEffect = "move";
    } else {
      e.dataTransfer.dropEffect = "none";
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (
      draggedTaskId !== "" &&
      tasks.some((task) => task.id === draggedTaskId)
    ) {
      e.dataTransfer.dropEffect = "none";
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (
      e.target === e.currentTarget ||
      !e.currentTarget.contains(e.target as Node)
    ) {
      // TaskCard 요소를 벗어나도 drop영역 표시가 사라지는 문제
      // 자식요소가 아닌 경우 dragEntered를 false를 주도록 함
      setDragEntered(false);
    }
  };

  const handleDrop = () => {
    if (
      draggedTaskId !== "" &&
      !tasks.some((task) => task.id === draggedTaskId)
    ) {
      // 다른 상태의 Board로 옮겼을 때만 update
      handleUpdateTask(draggedTaskId, type);
    }
    setDragEntered(false);
  };

  return (
    <div
      className={`flex flex-col h-full p-2 box-border items-center space-y-2 overflow-y-auto overflow-x-hidden
                ${dragEntered ? "outline outline-2 outline-dashed outline-indigo-500/50 outline-offset-[-2px] transition-shadow duration-100 ease-in-out shadow-[inset_0_0_7px_rgba(79,70,229,0.3)]" : ""}`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {tasks.map((task) => (
        <TaskCard key={`task-${task.id}`} task={task} />
      ))}
    </div>
  );
};

export default BoardContent;
