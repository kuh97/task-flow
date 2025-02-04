import { useEffect, useRef, useState } from "react";
import { differenceInDays, isBefore, isAfter } from "date-fns";
import Task, { Status } from "@models/Task";
import gantt from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import "./GanttChart.css";
import { configureGantt } from "./gantt.config";
import { STATUS_TITLES } from "@/constants/taskContants";
import ImageDropdown from "../common/ImageDropdown";
import { GanttChartTask, flattenTasksForGanttChart } from "@/utils/taskUtils";
import Modal from "../common/Modal";
import TaskForm, { FormData } from "../kanbanBoard/TaskForm";
import { useTaskValidation } from "@/hooks/task/useTaskValidation";
import { useTaskMutations } from "@/hooks/task/useTaskMutation";
import { useProjectStore } from "@/store/useProjectStore";

interface GanttChartProps {
  tasks: Task[];
}

const scaleOptions = [
  {
    label: "월",
    value: "month",
  },
  {
    label: "일",
    value: "day",
  },
  {
    label: "년",
    value: "year",
  },
];

const GanttChart = ({ tasks }: GanttChartProps) => {
  const [scale, setScale] = useState<string>("month");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [isUpdateBlockModalOpen, setUpdateBlockModalOpen] =
    useState<boolean>(false);

  const initialFormData = {
    name: "",
    description: "",
    status: "ToDo" as Status,
    managers: [],
    startDate: "",
    endDate: "",
  };
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [flattenedTasks, setFlattenedTasks] = useState<GanttChartTask[]>([]);
  const newStartDateRef = useRef<string | null>(null);
  const newEndDateRef = useRef<string | null>(null);

  const { errorMsg, validationCheck, clearFieldError } = useTaskValidation();

  const ganttContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const flattened = flattenTasksForGanttChart(tasks);
    setFlattenedTasks(flattened);
    if (ganttContainer.current) {
      configureGantt();
      gantt.init(ganttContainer.current);

      const chartTasks = {
        data: flattened.map((task) => {
          const duration = differenceInDays(
            new Date(task.endDate),
            new Date(task.startDate)
          );

          return {
            id: task.id,
            text: task.name,
            start_date: task.startDate,
            duration,
            status: STATUS_TITLES[task.status],
            progress: task.progress / 100,
            color: "#655ddc",
            parent: task.parent ?? "",
            open: true,
          };
        }),
        links: [],
      };

      gantt.parse(chartTasks);
    }

    // 더블클릭 이벤트 등록
    gantt.attachEvent("onTaskDblClick", function (id: string) {
      // 사용자 정의 다이얼로그 표시
      const targetTask = flattened.find((task) => task.id === id);
      setSelectedTaskId(id);
      if (targetTask) {
        let pStartDate, pEndDate;
        if (targetTask?.parent) {
          const parentTask = flattened.find(
            (task) => task.id === targetTask.parent
          );
          if (parentTask) {
            pStartDate = parentTask.startDate;
            pEndDate = parentTask.endDate;
          }
        }
        const targetFormData: FormData = {
          name: targetTask.name,
          description: targetTask.description,
          status: targetTask.status,
          managers: targetTask.managers,
          startDate: targetTask.startDate,
          endDate: targetTask.endDate,
          parentStartDate: pStartDate,
          parentEndDate: pEndDate,
        };
        setFormData(targetFormData);
        setEditModalOpen(true);
      }

      // 기본 다이얼로그를 비활성화
      return false;
    });

    // 드래그 이벤트 등록
    gantt.attachEvent(
      "onTaskDrag",
      function (id: string, mode: string, task: any) {
        const targetTask = flattened.find((task) => task.id === id);
        if (targetTask?.parent) {
          const parentTask = flattened.find(
            (task) => task.id === targetTask.parent
          );
          if (parentTask) {
            if (
              isBefore(
                new Date(task.start_date),
                new Date(parentTask.startDate)
              )
            ) {
              // 부모 Task 시작일보다 빠를 때
              newStartDateRef.current = null;
              return false;
            }
            if (
              isAfter(new Date(task.end_date), new Date(parentTask.endDate))
            ) {
              // 부모 Task 마감일보다 느릴 때
              newEndDateRef.current = null;
              return false;
            }
          }
        }
        newStartDateRef.current = task.start_date;
        newEndDateRef.current = task.end_date;
      }
    );

    // 드래그 종료 시 update
    gantt.attachEvent(
      "onAfterTaskDrag",
      function (id: string, mode: string, e: Event) {
        if (newStartDateRef.current == null || newEndDateRef.current == null) {
          setUpdateBlockModalOpen(true);
          return false;
        }
        const targetTask = flattened.find((task) => task.id === id);
        const formattedStartDate = new Date(
          newStartDateRef.current ?? ""
        ).toISOString();
        const formattedEndDate = new Date(
          newEndDateRef.current ?? ""
        ).toISOString();

        if (targetTask) {
          updateTask({
            id: targetTask.id,
            name: targetTask.name,
            description: targetTask.description,
            status: targetTask.status,
            managers: targetTask.managers,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            parentTaskId: targetTask.parent ?? "",
          });
        }
      }
    );

    return () => {
      gantt.clearAll();
    };
  }, [tasks]);

  const handleChangeScale = (value: string) => {
    setScale(value);
    switch (value) {
      case "day":
        gantt.config.scales = [
          { unit: "day", step: 1, format: "%d" },
          { unit: "month", step: 1, date: "%m월" },
        ];
        break;
      case "month":
        gantt.config.scales = [
          { unit: "month", step: 1, format: "%m월" },
          { unit: "year", step: 1, date: "%Y년" },
        ];
        break;
      case "year":
        gantt.config.scales = [{ unit: "year", step: 1, format: "%Y년" }];
        break;
      default:
        break;
    }

    gantt.render();
  };

  const { projectId } = useProjectStore();

  const { updateTask } = useTaskMutations({
    projectId,
    onSuccess: () => setEditModalOpen(false),
  });

  const handleUpdateTask = () => {
    // update task
    if (validationCheck(formData) && selectedTaskId) {
      const targetTask = flattenedTasks.find(
        (task) => task.id === selectedTaskId
      );
      if (targetTask) {
        updateTask({
          id: targetTask.id,
          name: formData.name,
          description: formData.description,
          status: formData.status,
          managers: formData.managers,
          startDate: formData.startDate,
          endDate: formData.endDate,
          parentTaskId: targetTask.parent ?? "",
        });
      }
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      <ImageDropdown
        image={<DropdownIcon />}
        value={scale}
        onChange={handleChangeScale}
        options={scaleOptions}
        className="w-[80px] mb-3"
      />
      <div ref={ganttContainer} className="w-full h-full" />
      <Modal
        title={"작업 수정"}
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        buttonLabel={"저장"}
        onClick={handleUpdateTask}
      >
        <TaskForm
          formData={formData}
          setFormData={setFormData}
          members={[]}
          errorMsg={errorMsg}
          clearFieldError={clearFieldError}
        />
      </Modal>
      <Modal
        title="기간 변경 불가"
        isOpen={isUpdateBlockModalOpen}
        onClose={() => setUpdateBlockModalOpen(false)}
        buttonLabel="확인"
        onClick={() => setUpdateBlockModalOpen(false)}
        className="bg-opacity-20"
      >
        <p className="my-4 whitespace-pre-line">
          {
            "이 날짜는 부모 작업의 기간을 초과합니다.\n부모 작업의 날짜를 수정한 후 다시 시도해 주세요."
          }
        </p>
      </Modal>
    </div>
  );
};

const DropdownIcon = () => {
  return (
    <svg fill="none" height="24" viewBox="0 0 24 24" width="24">
      <path
        d="M6.25 3C4.45507 3 3 4.45507 3 6.25V17.75C3 19.5449 4.45507 21 6.25 21H17.75C19.5449 21 21 19.5449 21 17.75V6.25C21 4.45507 19.5449 3 17.75 3H6.25ZM4.5 6.25C4.5 5.2835 5.2835 4.5 6.25 4.5H17.75C18.7165 4.5 19.5 5.2835 19.5 6.25V8.5H4.5V6.25ZM10 10H14V14H10V10ZM8.5 10V14H4.5V10H8.5ZM8.5 15.5V19.5H6.25C5.2835 19.5 4.5 18.7165 4.5 17.75V15.5H8.5ZM10 19.5V15.5H14V19.5H10ZM15.5 14V10H19.5V14H15.5ZM15.5 15.5H19.5V17.75C19.5 18.7165 18.7165 19.5 17.75 19.5H15.5V15.5Z"
        fill="#3730a3"
      />
    </svg>
  );
};

export default GanttChart;
