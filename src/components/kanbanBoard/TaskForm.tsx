import { useState } from "react";
import TextField from "../common/TextField";
import { format } from "date-fns";
import Dropdown, { Option } from "../common/Dropdown";
import CustomRangeDatePicker from "../common/CustomRangeDatePicker";
import Member from "@/models/Member";
import TextArea from "../common/TextArea";
import SearchableDropdown from "../common/SearchableDropdown";
import { Status } from "@/models/Task";

export interface FormData {
  name: string;
  description: string;
  status: Status;
  managers: Member[];
  startDate: string;
  endDate: string;
}

export interface ErrorMessage {
  name?: string;
  date?: string;
}

interface TaskFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  members: Member[];
  errorMsg: ErrorMessage;
  clearFieldError: (value: string) => void;
}

interface SearchableItem {
  id: number | string;
  label: string;
  subLabel?: string;
}

const TaskForm = ({
  formData,
  setFormData,
  members,
  errorMsg,
  clearFieldError,
}: TaskFormProps) => {
  const [name, setName] = useState<string>(formData.name);
  const [description, setDescription] = useState<string>(formData.description);
  const [status, setStatus] = useState<Status>(formData.status);
  const [startDate, setStartDate] = useState<Date | null>(
    formData.startDate === "" ? null : new Date(formData.startDate)
  );
  const [endDate, setEndDate] = useState<Date | null>(
    formData.endDate === "" ? null : new Date(formData.endDate)
  );
  const [searchValue, setSearchValue] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<Member[]>(
    formData.managers
  );

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const statusOptions: Option[] = [
    { label: "작업 예정", value: "ToDo" },
    { label: "작업 중", value: "InProgress" },
    { label: "작업 완료", value: "Done" },
  ];

  const availableMembers = members.filter(
    (member) => !selectedMembers.some((selected) => selected.id === member.id)
  );

  const mapMemberToSearchableItem = (member: Member): SearchableItem => ({
    id: member.id,
    label: member.nickname,
    subLabel: member.email,
  });

  const handleSelectMember = (item: SearchableItem) => {
    const member = members.find((m) => m.id === item.id);
    if (!member) return;

    setSelectedMembers((prev) => {
      const newMembers = [...prev, member];
      setFormData((prevForm) => ({
        ...prevForm,
        managers: newMembers,
      }));
      return newMembers;
    });
    setSearchValue("");
  };

  const handleRemoveMember = (memberId: string) => {
    setSelectedMembers((prev) => {
      const newMembers = prev.filter((member) => member.id !== memberId);
      setFormData((prevForm) => ({
        ...prevForm,
        managers: newMembers,
      }));

      return newMembers;
    });
  };

  const handleChangeName = (value: string) => {
    clearFieldError("name");
    setName(value);
    setFormData((prev) => ({ ...prev, name: value }));
  };

  const handleChangeDescription = (value: string) => {
    setDescription(value);
    setFormData((prev) => ({ ...prev, description: value }));
  };

  const handleChangeStatus = (value: string) => {
    setStatus(value as Status);
    setFormData((prev) => ({ ...prev, status: value as Status }));
  };

  const handleChangeStartDate = (date: Date | null) => {
    setStartDate(date);
    clearFieldError("date");
    if (date) {
      setFormData((prev) => ({
        ...prev,
        startDate: format(date, "yyyy-MM-dd"),
      }));
      setEndDate(null);
      setFormData((prev) => ({ ...prev, endDate: "" }));
    } else {
      setFormData((prev) => ({
        ...prev,
        startDate: "",
        endDate: "",
      }));
      setEndDate(null);
    }
  };

  const handleChangeEndDate = (date: Date | null) => {
    setEndDate(date);
    if (date) {
      setFormData((prev) => ({
        ...prev,
        endDate: format(date, "yyyy-MM-dd"),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        endDate: "",
      }));
    }
  };

  return (
    <form className="flex flex-col w-[800px] pt-6 pr-5 pb-0 pl-5">
      <div className="grid grid-cols-[2fr,1fr] gap-8">
        {/* 왼쪽 영역 */}
        <div className="space-y-8 border-r border-gray-200 pr-8">
          <div>
            <label className="font-medium text-gray-900">
              제목<span className="pl-1 text-red-600">*</span>
            </label>
            <TextField
              value={name}
              onChange={handleChangeName}
              errorMessage={errorMsg["name"]}
              placeholder="제목을 입력하세요"
            />
          </div>

          <div>
            <label className="font-medium text-gray-900">설명</label>
            <TextArea
              value={description}
              onChange={handleChangeDescription}
              placeholder="설명을 입력하세요"
              className="min-h-[100px] w-full overflow-y-auto"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="font-medium text-gray-900">
                기간<span className="pl-1 text-red-600">*</span>
              </label>
              <CustomRangeDatePicker
                startDate={startDate}
                endDate={endDate}
                onChangeStart={handleChangeStartDate}
                onChangeEnd={handleChangeEndDate}
                errorMessage={errorMsg["date"]}
                isOpen={isDatePickerOpen}
                onOpenChange={setIsDatePickerOpen}
              />
            </div>

            <div>
              <label className="font-medium text-gray-900">
                상태<span className="pl-1 text-red-600">*</span>
              </label>
              <Dropdown
                value={status}
                options={statusOptions}
                onChange={handleChangeStatus}
                placeholder="상태를 선택하세요"
              />
            </div>
          </div>
        </div>

        {/* 오른쪽 영역 */}
        <div className="space-y-4 h-full">
          <div>
            <label className="font-medium text-gray-900">
              담당자 추가{" "}
              {selectedMembers.length > 0 && `(${selectedMembers.length})`}
            </label>
            <SearchableDropdown<SearchableItem>
              value={searchValue}
              onChange={setSearchValue}
              onSelect={handleSelectMember}
              items={availableMembers.map(mapMemberToSearchableItem)}
              placeholder="이름 및 이메일을 입력하세요"
            />
          </div>

          {selectedMembers.length > 0 && (
            <div className="border rounded-lg max-h-[336px] overflow-y-auto">
              {selectedMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between px-4 py-3 hover:bg-indigo-50 border-b last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-sm">
                      {member.nickname.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {member.nickname}
                      </span>
                      <span className="text-xs text-gray-500">
                        {member.email}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(member.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default TaskForm;
