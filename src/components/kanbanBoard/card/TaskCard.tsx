import React from "react";
import Task from "@models/Task";
import CardHeader from "@components/kanbanBoard/card/CardHeader";
import CardFooter from "@components/kanbanBoard/card/CardFooter";
import { useTaskCardDragContext } from "@/context/TaskCardDragContext";
import { useTaskSelectContext } from "@/context/TaskSelectContext";

interface TaskCardProps {
  task: Task;
}

const TaskCard = ({ task }: TaskCardProps) => {
  const { setDraggedTaskId } = useTaskCardDragContext();
  const { setSelectedTaskId } = useTaskSelectContext();

  const handleClickCard = () => {
    setSelectedTaskId(task.id);
  };

  const handleDragStart = (e: React.DragEvent) => {
    setDraggedTaskId(task.id);
    // 드래그 이미지로 사용
    const img = new Image();
    img.src = "/src/assets/taskDragImage.svg"; // 여기에 실제 SVG 파일 경로를 넣습니다.
    e.dataTransfer.setDragImage(img, 15, 15);

    img.onload = () => {
      e.dataTransfer.setDragImage(img, 15, 15);
    };
  };

  const handleDragEnd = () => {
    setDraggedTaskId("");
  };

  return (
    <div
      className={`w-[280px] h-[160px] border border-gray-200 rounded-xl bg-white p-3 cursor-pointer
                  hover:scale-[1.03] hover:shadow-[0_2px_6px_rgba(0,0,0,0.1)] transition-transform duration-150 ease-in-out`}
      onClick={handleClickCard}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <CardHeader name={task.name} managers={task.managers} />
      <div className="flex-col h-[60px]">
        <p className="text-sm text-gray-500 font-light line-clamp-2">
          {task.description}
        </p>
      </div>
      <CardFooter
        startDate={task.startDate}
        endDate={task.endDate}
        subTasks={task.subTasks}
      />
    </div>
  );
};

export default React.memo(TaskCard);
