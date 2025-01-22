import { useEffect, useRef, useState } from "react";
import { differenceInDays } from "date-fns";
import Task from "@models/Task";
import gantt from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import "./GanttChart.css";
import { configureGantt } from "./gantt.config";
import { STATUS_TITLES } from "@/constants/taskContants";
import ImageDropdown from "../common/ImageDropdown";

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
  const ganttContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ganttContainer.current) {
      configureGantt();
      gantt.init(ganttContainer.current);

      const chartTasks = {
        data: tasks.map((task) => {
          const formattedStartDate = task.startDate;
          const formattedEndDate = task.endDate;
          const duration = differenceInDays(
            new Date(formattedEndDate),
            new Date(formattedStartDate)
          );

          return {
            id: task.id,
            text: task.name,
            start_date: formattedStartDate,
            duration,
            status: STATUS_TITLES[task.status],
            progress: task.progress / 100,
            color: "#655ddc",
          };
        }),
        links: [],
      };

      gantt.parse(chartTasks);
    }

    return () => {
      gantt.clearAll();
    };
  }, []);

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
