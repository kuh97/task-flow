import { useMemo, useState } from "react";
import Icon from "../common/icon/Icon";
import Tabs, { Tab } from "../common/Tabs";
import TextField from "../common/TextField";
import { useTaskSelectContext } from "@/context/TaskSelectContext";
import Task from "@/models/Task";
import CommentSection from "./comment/CommentSection";
import { useProjectStore } from "@/store/useProjectStore";

interface TaskTabsProps {
  task: Task;
  isSubTask?: boolean;
  handleSaveSubTask: (newTitle: string) => void;
}

/**
 * Task 클릭 시 나타나는 R-Toolpane 영역의 Tab 컴포넌트
 * 하위 작업과 댓글로 구성
 */
const TaskTabs = ({
  task,
  isSubTask = false,
  handleSaveSubTask,
}: TaskTabsProps) => {
  const { projectId } = useProjectStore();
  const { selectedSubTaskId, setSelectedSubTaskId } = useTaskSelectContext();

  const [isAddingSubTask, setIsAddingSubTask] = useState<boolean>(false);
  const [newSubTaskTitle, setNewSubTaskTitle] = useState<string>("");

  const selectedTask = useMemo(() => {
    return isSubTask
      ? task.subTasks.find((st) => st.id === selectedSubTaskId)
      : task;
  }, [task, isSubTask, selectedSubTaskId]);

  const handleAddSubTask = () => {
    setIsAddingSubTask(true);
  };

  const handleChangeSubTaskTitle = (value: string) => {
    setNewSubTaskTitle(value);
  };

  const handleSubTaskTitleOutsideClick = () => {
    setIsAddingSubTask(false);
    setNewSubTaskTitle("");
  };

  const handleSubTaskClick = (taskId: string) => {
    setSelectedSubTaskId(taskId);
  };

  const onSaveSubTask = () => {
    handleSaveSubTask(newSubTaskTitle);
    setIsAddingSubTask(false);
    setNewSubTaskTitle("");
  };

  return (
    <Tabs>
      <Tab
        value="subtasks"
        label={
          <div className="flex items-center">
            <span>하위 작업</span>
            <div className="flex ml-2 justify-center w-[16px] h-[16px] rounded-full bg-indigo-100 text-xs text-indigo-500">
              {selectedTask?.subTasks?.length ?? 0}
            </div>
          </div>
        }
      >
        {!isSubTask && (
          <div>
            <div className="flex justify-end mb-2">
              <button
                className="text-sm px-3 py-1 rounded border hover:bg-gray-50"
                onClick={handleAddSubTask}
              >
                + 추가
              </button>
            </div>

            <div className="space-y-2">
              {isAddingSubTask && (
                <div
                  className="flex-1 flex items-center gap-2 relative"
                  onBlur={handleSubTaskTitleOutsideClick}
                >
                  <TextField
                    value={newSubTaskTitle}
                    onChange={handleChangeSubTaskTitle}
                    errorMessage={""}
                    placeholder={"제목을 입력하세요"}
                    className="!mt-0"
                    autoFocus={true}
                  />
                  <div className="absolute right-0 top-[46px] flex gap-2 z-10">
                    <button
                      onMouseDown={onSaveSubTask}
                      className="p-2 hover:bg-gray-50 bg-white rounded border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-all duration-200"
                    >
                      <Icon name={"saveButton"} className={"w-5 h-5"} />
                    </button>
                    <button
                      onMouseDown={handleSubTaskTitleOutsideClick}
                      className="p-2 hover:bg-gray-50 bg-white rounded border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-all duration-200"
                    >
                      <Icon name={"deleteButton"} className={"w-5 h-5"} />
                    </button>
                  </div>
                </div>
              )}

              {task.subTasks.map((taskItem) => (
                <div
                  key={`subtask-${taskItem.id}`}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-md border border-gray-200 cursor-pointer group"
                  onClick={() => handleSubTaskClick(taskItem.id)}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      taskItem.status === "Done"
                        ? "bg-green-500"
                        : taskItem.status === "InProgress"
                          ? "bg-blue-500"
                          : "bg-gray-300"
                    }`}
                  />
                  <span className="text-sm flex-1">{taskItem.name}</span>
                  <Icon
                    name="rightArrow"
                    className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </Tab>
      <Tab
        value="comments"
        label={
          <div className="flex items-center">
            <span>댓글</span>
            <div className="flex ml-2 justify-center w-[16px] h-[16px] rounded-full bg-indigo-100 text-xs text-indigo-500">
              {selectedTask?.comments?.length ?? 0}
            </div>
          </div>
        }
      >
        {selectedTask && (
          <CommentSection
            projectId={projectId}
            taskId={selectedTask.id}
            parentTaskId={isSubTask ? task.id : undefined}
            comments={selectedTask.comments ?? []}
          />
        )}
      </Tab>
    </Tabs>
  );
};

export default TaskTabs;
