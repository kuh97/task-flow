import gantt from "dhtmlx-gantt";

interface GanttTask {
  id: number;
  text: string;
  start_date: string;
  duration: number;
  status: string;
}

export const configureGantt = () => {
  gantt.config.columns = [
    {
      name: "text",
      label: "작업명",
      width: 200,
      tree: true,
    },
    {
      name: "duration",
      label: "기간 (일)",
      align: "center",
      width: 100,
    },
    {
      name: "status",
      label: "상태",
      template: (task: GanttTask) => `
        <div style="display: flex; align-items: center; gap: 8px;">
          <div
            style="
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background-color: ${
                task.status === "작업 완료"
                  ? "#10B981"
                  : task.status === "작업 중"
                    ? "#3B82F6"
                    : "#D1D5DB"
              };
            "
          ></div>
          <span>${task.status}</span>
        </div>
      `,
      width: 150,
    },
  ];

  gantt.templates.parse_date = function (date: string) {
    return new Date(date);
  };
  gantt.config.scales = [
    {
      unit: "month",
      step: 1,
      format: "%m월",
    },
    { unit: "year", step: 1, date: "%Y년" },
  ];
  gantt.config.links = false; // 링크를 비활성화
};
