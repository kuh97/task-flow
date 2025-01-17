import { useTaskSelectContext } from "@/context/TaskSelectContext";

interface RightToolPaneProps {
  projectId: string;
  isSubTask?: boolean;
}

import { useEffect, useState } from "react";
import Icon from "./common/Icon";
import Dropdown, { Option } from "./common/Dropdown";
import { Status } from "@/models/Task";
import CustomRangeDatePicker from "./common/CustomRangeDatePicker";
import { format } from "date-fns";
import TextArea from "./common/TextArea";
import TextField from "./common/TextField";
import { useProjectData } from "@/hooks/project/useProjectMutation";
import {
  useCreateSubTask,
  useUpdateTaskMutation,
} from "@/hooks/task/useTaskMutation";

const RightToolPane = ({ isSubTask = false }: RightToolPaneProps) => {
  const {
    selectedTaskId,
    setSelectedTaskId,
    selectedSubTaskId,
    setSelectedSubTaskId,
  } = useTaskSelectContext();
  const { data: project } = useProjectData();
  if (project === null) {
    return null;
  }

  const { mutate: updateTask } = useUpdateTaskMutation({
    projectId: project.id,
  });

  const { mutate: createSubTask } = useCreateSubTask();

  const parentTask = project.tasks.find((t) => t.id === selectedTaskId);
  const selectedTask = isSubTask
    ? parentTask?.subTasks.find((st) => st.id === selectedSubTaskId)
    : parentTask;

  const [isTitleEditMode, setIsTitleEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState("");

  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [isDescriptionEditMode, setIsDescriptionEditMode] =
    useState<boolean>(false);
  const [editDescription, setEditDescription] = useState<string>("");

  const [isAddingSubTask, setIsAddingSubTask] = useState<boolean>(false);
  const [newSubTaskTitle, setNewSubTaskTitle] = useState<string>("");

  useEffect(() => {
    if (selectedTask) {
      setStartDate(new Date(selectedTask.startDate));
      setEndDate(new Date(selectedTask.endDate));
      setErrorMsg("");
      setIsDatePickerOpen(false);
      setIsAddingSubTask(false);
    }
  }, [selectedTask]);

  const statusOptions: Option[] = [
    { label: "작업 예정", value: "ToDo" },
    { label: "작업 중", value: "InProgress" },
    { label: "작업 완료", value: "Done" },
  ];

  const handleClickHomeButton = () => {
    setSelectedTaskId(null);
    setSelectedSubTaskId(null);
  };

  const handleTitleClick = () => {
    setIsTitleEditMode(true);
    setEditTitle(selectedTask?.name || "");
  };

  const handleChangeTitle = (value: string) => {
    setEditTitle(value);
  };

  const handleTitleSave = () => {
    if (!project || !selectedTask || !editTitle.trim()) return;

    if (isSubTask && parentTask) {
      updateTask({
        id: selectedTask.id,
        name: editTitle,
        parentTaskId: parentTask.id,
      });
    } else {
      updateTask({
        id: selectedTask.id,
        name: editTitle,
      });
    }
    setIsTitleEditMode(false);
  };

  const handleTitleOutsideClick = () => {
    setIsTitleEditMode(false);
    setEditTitle("");
  };

  const handleChangeStatus = (value: string) => {
    if (!project || !selectedTask || selectedTask?.status === value) return;

    if (isSubTask && parentTask) {
      updateTask({
        id: selectedTask.id,
        status: value as Status,
        parentTaskId: parentTask.id,
      });
    } else {
      updateTask({
        id: selectedTask.id,
        status: value as Status,
      });
    }
  };

  const handleChangeStartDate = (date: Date | null) => {
    if (date) {
      setStartDate(date);
      setEndDate(null);
      setErrorMsg("");
    } else {
      setStartDate(null);
      setEndDate(null);
      setErrorMsg("시작일/마감일을 선택해주세요");
    }
  };

  const handleChangeEndDate = (date: Date | null) => {
    if (!project || !selectedTask || !startDate || !date) return;

    if (isSubTask && parentTask) {
      updateTask({
        id: selectedTask.id,
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: format(date, "yyyy-MM-dd"),
        parentTaskId: parentTask.id,
      });
    } else {
      updateTask({
        id: selectedTask.id,
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: format(date, "yyyy-MM-dd"),
      });
    }
    setEndDate(date);
    setErrorMsg("");
  };

  const handleCheckDateError = () => {
    let dateErrorMsg = "";
    if (!startDate) {
      dateErrorMsg += "시작일";
    }
    if (!endDate) {
      if (dateErrorMsg !== "") {
        dateErrorMsg += "/마감일을 선택해주세요";
      } else {
        dateErrorMsg += "마감일을 선택해주세요";
      }
    }
    setErrorMsg(dateErrorMsg);
  };

  const handleDescriptionClick = () => {
    setIsDescriptionEditMode(true);
    setEditDescription(selectedTask?.description || "");
  };

  const handleDescriptionSave = () => {
    if (!project || !selectedTask || !editDescription.trim()) return;

    if (isSubTask && parentTask) {
      updateTask({
        id: selectedTask.id,
        description: editDescription,
        parentTaskId: parentTask.id,
      });
    } else {
      updateTask({
        id: selectedTask.id,
        description: editDescription,
      });
    }
    setIsDescriptionEditMode(false);
  };

  const handleDescriptionOutsideClick = () => {
    setIsDescriptionEditMode(false);
    setEditDescription("");
  };

  const handleAddSubTask = () => {
    setIsAddingSubTask(true);
  };

  const handleChangeSubTaskTitle = (value: string) => {
    setNewSubTaskTitle(value);
  };

  const handleSaveSubTask = () => {
    if (project && selectedTask && newSubTaskTitle.trim()) {
      const newSubTask = {
        name: newSubTaskTitle,
        description: "",
        status: "ToDo" as Status,
        startDate: selectedTask.startDate,
        endDate: selectedTask.endDate,
        progress: 0,
      };

      createSubTask({
        parentTaskId: selectedTask.id,
        subTask: newSubTask,
      });

      setIsAddingSubTask(false);
      setNewSubTaskTitle("");
    }
  };

  const handleSubTaskTitleOutsideClick = () => {
    setIsAddingSubTask(false);
    setNewSubTaskTitle("");
  };

  const handleSubTaskClick = (taskId: string) => {
    setSelectedSubTaskId(taskId);
  };

  if (!selectedTask) return null;

  return (
    <>
      <div
        className={`fixed right-0 top-0 w-[400px] h-full bg-white shadow-lg z-50`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="fixed right-[400px] p-2 py-5 bg-white rounded-l-md shadow-[-2px_0_4px_rgba(0,0,0,0.1)] group"
          onClick={(e) => {
            e.stopPropagation();
            handleClickHomeButton();
          }}
        >
          <Icon name="rightArrow" className={`w-5 h-5 text-gray-400`} />
        </button>

        <div className="flex flex-col h-full">
          {/* <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <button
              className="p-4 rounded-full shadow-lg transition-colors duration-200 flex items-center justify-center hover:bg-gray-100 group"
              onClick={() => {}}
            >
              <Icon name="trash" className="w-6 h-6 text-red-500" />
            </button>
          </div> */}

          {isSubTask && parentTask && (
            <button
              className="w-fit text-lg p-4 text-indigo-600 hover:underline inline-flex items-center gap-1"
              onClick={() => setSelectedSubTaskId(null)}
            >
              {parentTask.name}
            </button>
          )}

          <div className="flex justify-between items-center p-4 border-b h-[75px]">
            {isTitleEditMode ? (
              <div
                className="flex-1 flex items-center gap-2 relative"
                onBlur={handleTitleOutsideClick}
                onClick={handleTitleClick}
              >
                <TextField
                  value={isTitleEditMode ? editTitle : selectedTask.name}
                  onChange={handleChangeTitle}
                  errorMessage={""}
                  placeholder={"제목을 입력하세요"}
                  className="h-[50px] !mt-0 !text-2xl font-semibold"
                  autoFocus={true}
                />
                {isTitleEditMode && (
                  <div className="absolute right-0 top-[54px] flex gap-2 z-10">
                    <button
                      onMouseDown={handleTitleSave}
                      className="p-2 hover:bg-gray-50 bg-white rounded border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-all duration-200"
                    >
                      <Icon name={"saveButton"} className={"w-5 h-5"} />
                    </button>
                    <button
                      onMouseDown={handleTitleOutsideClick}
                      className="p-2 hover:bg-gray-50 bg-white rounded border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-all duration-200"
                    >
                      <Icon name={"deleteButton"} className={"w-5 h-5"} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <h1
                className="w-full text-2xl font-semibold p-2 hover:bg-gray-50 rounded cursor-pointer truncate"
                onClick={handleTitleClick}
              >
                {selectedTask.name}
              </h1>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-3 border-b">
              <div className="flex items-center gap-3">
                <div className="w-full">
                  <div className="text-sm text-gray-500">상태</div>
                  <Dropdown
                    value={selectedTask.status}
                    options={statusOptions}
                    onChange={handleChangeStatus}
                    placeholder="상태를 선택하세요"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-full">
                  <div className="text-sm text-gray-500">기한</div>
                  <CustomRangeDatePicker
                    startDate={startDate}
                    endDate={endDate}
                    onChangeStart={handleChangeStartDate}
                    onChangeEnd={handleChangeEndDate}
                    errorMessage={errorMsg}
                    onBlur={handleCheckDateError}
                    isOpen={isDatePickerOpen}
                    onOpenChange={setIsDatePickerOpen}
                    mustSelectFullRange={true}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-full">
                  <div className="text-sm text-gray-500">설명</div>
                  <div
                    className="flex-1 flex items-center gap-2 relative"
                    onBlur={handleDescriptionOutsideClick}
                    onClick={handleDescriptionClick}
                  >
                    <TextArea
                      value={
                        isDescriptionEditMode
                          ? editDescription
                          : selectedTask.description
                      }
                      onChange={setEditDescription}
                      className="h-[130px]"
                      readOnly={!isDescriptionEditMode}
                    />
                    {isDescriptionEditMode && (
                      <div className="absolute right-0 top-[144px] flex gap-2 z-10">
                        <button
                          onMouseDown={handleDescriptionSave}
                          className="p-2 hover:bg-gray-50 bg-white rounded border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-all duration-200"
                        >
                          <Icon name={"saveButton"} className={"w-5 h-5"} />
                        </button>
                        <button
                          onMouseDown={handleTitleOutsideClick}
                          className="p-2 hover:bg-gray-50 bg-white rounded border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-all duration-200"
                        >
                          <Icon name={"deleteButton"} className={"w-5 h-5"} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* <div>
                <div className="text-sm text-gray-500">담당자</div>
                <div className="font-medium p-2 hover:bg-gray-50 rounded cursor-pointer">
                  {selectedTask.managers.map((m) => m.nickname).join(", ")}
                </div>
              </div> */}
            </div>
            {!isSubTask && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm text-gray-500">{`하위 작업 (${selectedTask.subTasks.length})`}</h3>
                  <div className="flex gap-2">
                    <button
                      className="text-sm px-3 py-1 rounded border hover:bg-gray-50"
                      onClick={handleAddSubTask}
                    >
                      + 추가
                    </button>
                  </div>
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
                          onMouseDown={handleSaveSubTask}
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

                  {selectedTask.subTasks.map((task) => (
                    <div
                      key={`subtask-${task.id}`}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-md border border-gray-200 cursor-pointer group"
                      onClick={() => handleSubTaskClick(task.id)}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          task.status === "Done"
                            ? "bg-green-500"
                            : task.status === "InProgress"
                              ? "bg-blue-500"
                              : "bg-gray-300"
                        }`}
                      />
                      <span className="text-sm flex-1">{task.name}</span>
                      <Icon
                        name="rightArrow"
                        className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* <Icon name={"trash"} className={"w-5 h-5"} /> */}
    </>
  );
};

export default RightToolPane;
