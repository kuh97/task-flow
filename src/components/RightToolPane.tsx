import { useTaskSelectContext } from "@/context/TaskSelectContext";

interface RightToolPaneProps {
  projectId: string;
  isSubTask?: boolean;
}

import { useEffect, useState } from "react";
import Icon from "@common/icon/Icon";
import Dropdown, { Option } from "./common/Dropdown";
import { Status } from "@/models/Task";
import CustomRangeDatePicker from "./common/CustomRangeDatePicker";
import { format } from "date-fns";
import TextArea from "./common/TextArea";
import TextField from "./common/TextField";
import { useProjectData } from "@/hooks/project/useProjectMutation";
import { useTaskMutations } from "@/hooks/task/useTaskMutation";
import KebabMenu from "./common/KebabMenu";
import Modal from "./common/Modal";
import { useProjectStore } from "@/store/useProjectStore";
import SearchableDropdown from "./common/SearchableDropdown";
import Member from "@/models/Member";

interface SearchableItem {
  id: number | string;
  label: string;
  subLabel?: string;
  profileImage?: string;
}

const RightToolPane = ({ isSubTask = false }: RightToolPaneProps) => {
  const {
    selectedTaskId,
    setSelectedTaskId,
    selectedSubTaskId,
    setSelectedSubTaskId,
  } = useTaskSelectContext();
  const { projectId } = useProjectStore();
  const { data: project } = useProjectData(projectId);
  if (project === null) {
    return null;
  }

  const {
    updateTask,
    deleteTask,
    createSubTask,
    deleteSubTask,
    addMemberToTask,
    removeMemberFromTask,
  } = useTaskMutations({ projectId: project.id });

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
  const [isKebabMenuOpen, setIsKebabMenuOpen] = useState<boolean>(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const [isAddingMember, setIsAddingMember] = useState<boolean>(false);
  const [searchMemberValue, setSearchMemberValue] = useState("");

  const availableMembers = project.members.filter(
    (member) =>
      !selectedTask?.managers.some((selected) => selected.id === member.id)
  );

  const mapMemberToSearchableItem = (member: Member): SearchableItem => ({
    id: member.id,
    label: member.nickname,
    subLabel: member.email,
    profileImage: member.profileImage,
  });

  const handleSelectMember = (item: SearchableItem) => {
    const member = project.members.find((m) => m.id === item.id);
    if (selectedTask && member) {
      addMemberToTask({
        taskId: selectedTask.id,
        memberId: member.id,
      });
    }
    setIsAddingMember(false);
  };

  useEffect(() => {
    if (selectedTask) {
      setStartDate(new Date(selectedTask.startDate));
      setEndDate(new Date(selectedTask.endDate));
      setErrorMsg("");
      setIsDatePickerOpen(false);
      setIsAddingSubTask(false);
      setIsKebabMenuOpen(false);
      setIsDeleteModalOpen(false);
      setIsAddingMember(false);
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

  const handleClickThreeDots = () => {
    setIsKebabMenuOpen(!isKebabMenuOpen);
  };

  const confirmDelete = () => {
    if (project && selectedTask) {
      if (isSubTask && parentTask) {
        deleteSubTask({
          parentTaskId: parentTask.id,
          subTaskId: selectedTask.id,
        });
        setSelectedSubTaskId(null);
      } else {
        deleteTask({ taskId: selectedTask.id });
        setSelectedTaskId(null);
      }
      setIsDeleteModalOpen(false);
      setIsKebabMenuOpen(false);
    }
  };

  const kebabMenuItems = [
    {
      label: "삭제",
      onClick: () => setIsDeleteModalOpen(true),
    },
  ];

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

  const handleAddMember = () => {
    setIsAddingMember(true);
  };

  const handleRemoveMember = (memberId: string) => {
    if (selectedTask) {
      removeMemberFromTask({
        taskId: selectedTask.id,
        memberId: memberId,
      });
    }
  };

  const handleCloseMember = () => {
    setIsAddingMember(false);
    setSearchMemberValue("");
  };

  if (!selectedTask) return null;

  return (
    <>
      <div
        className={`fixed right-0 top-0 w-[400px] h-full bg-white shadow-lg z-48`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className={`fixed right-[400px] p-2 py-5 bg-white rounded-l-md shadow-[-2px_0_4px_rgba(0,0,0,0.1)] group disabled:bg-[rgb(204,204,204)]`}
          onClick={(e) => {
            e.stopPropagation();
            handleClickHomeButton();
          }}
          disabled={isDeleteModalOpen}
        >
          <Icon name="rightArrow" className={`w-5 h-5 text-gray-400`} />
        </button>

        <div className="flex flex-col h-full">
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
            <div className="relative">
              <button
                onMouseDown={handleClickThreeDots}
                className="p-1 hover:bg-gray-50 rounded cursor-pointer"
                onBlurCapture={handleClickThreeDots}
              >
                <Icon name={"threeDots"} className={"w-8 h-8 rotate-90"} />
              </button>
              {isKebabMenuOpen && (
                <KebabMenu
                  menuItems={kebabMenuItems}
                  onClose={() => handleClickThreeDots}
                  className="w-[60px]"
                />
              )}
            </div>
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
                    className="mt-2"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-full">
                  <div className="text-sm text-gray-500">기한</div>
                  <CustomRangeDatePicker
                    startDate={startDate}
                    endDate={endDate}
                    minDate={
                      isSubTask && parentTask
                        ? new Date(parentTask?.startDate)
                        : undefined
                    }
                    maxDate={
                      isSubTask && parentTask
                        ? new Date(parentTask?.endDate)
                        : undefined
                    }
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

              {!isSubTask && (
                <div className="flex items-center gap-2">
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm text-gray-500">{`담당자 (${selectedTask.managers.length})`}</h3>
                      <div className="flex gap-2">
                        <button
                          className="text-sm px-3 py-1 rounded border hover:bg-gray-50"
                          onClick={handleAddMember}
                        >
                          + 추가
                        </button>
                      </div>
                    </div>
                    {isAddingMember && (
                      <div className="flex gap-1 items-center mb-2">
                        <SearchableDropdown<SearchableItem>
                          value={searchMemberValue}
                          onChange={setSearchMemberValue}
                          onSelect={handleSelectMember}
                          items={availableMembers.map(
                            mapMemberToSearchableItem
                          )}
                          placeholder="이름 및 이메일을 입력하세요"
                        />
                        <button onClick={handleCloseMember}>
                          <Icon name={"deleteButton"} className={"w-5 h-5"} />
                        </button>
                      </div>
                    )}

                    <div className="h-[100px] overflow-y-scroll border-[1.5px] border-gray-300 rounded-md px-1 pb-1">
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedTask.managers.map((manager) => (
                          <div
                            key={manager.id}
                            className="bg-white text-gray-700 text-xs py-1 px-2 rounded-full flex items-center gap-2 border border-gray-300 hover:bg-indigo-100 transition-colors"
                          >
                            <div className="w-5 h-5 rounded-full overflow-hidden">
                              <img
                                src={
                                  manager.profileImage ||
                                  `https://ui-avatars.com/api/?name=${manager.nickname}`
                                } // 이미지를 로드하지 못할 경우 기본 이미지 사용
                                alt={manager.nickname}
                                className="w-full h-full object-cover"
                                onError={(e: any) => {
                                  // 이미지 로드 실패 시 기본 이미지로 대체
                                  e.target.onerror = null;
                                  e.target.src = `https://ui-avatars.com/api/?name=${manager.nickname}`;
                                }}
                              />
                            </div>
                            {manager.nickname}
                            <button
                              onClick={() => handleRemoveMember(manager.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
      <Modal
        title="작업 삭제"
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        buttonLabel="삭제"
        onClick={confirmDelete}
        className="bg-opacity-20"
      >
        <p className="my-4">정말로 이 작업을 삭제하시겠습니까?</p>
      </Modal>
    </>
  );
};

export default RightToolPane;
