import { useState } from "react";
import CustomSingleDatePicker from "@/components/common/CustomSingleDatePicker";
import TextField from "../common/TextField";
import { format } from "date-fns";

export interface FormData {
  [key: string]: string;
}

export interface ErrorMessage {
  [key: keyof FormData]: string;
}

interface CreateProjectFormProps {
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errorMessages: ErrorMessage;
  setErrorMsg: React.Dispatch<React.SetStateAction<ErrorMessage>>;
}

const CreateProjectForm = ({
  setFormData,
  errorMessages,
  setErrorMsg,
}: CreateProjectFormProps) => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleChangeName = (value: string) => {
    setErrorMsg((prev) => ({
      ...prev,
      ["name"]: "",
    }));
    setName(value);
    setFormData((prev) => ({ ...prev, ["name"]: value }));
  };

  const handleChangeDescription = (value: string) => {
    setErrorMsg((prev) => ({
      ...prev,
      ["description"]: "",
    }));
    setDescription(value);
    setFormData((prev) => ({ ...prev, ["description"]: value }));
  };

  const handleChangeDate = (date: Date | null) => {
    setEndDate(date);
    if (date) {
      setFormData((prev) => ({
        ...prev,
        ["endDate"]: format(date, "yyyy-MM-dd"),
      }));
    } else {
      // date가 null일 때 FormData에서도 초기화
      setFormData((prev) => ({
        ...prev,
        ["endDate"]: "",
      }));
    }
  };

  return (
    <div className="flex flex-col w-[350px] pt-4">
      <div className="grid grid-rows-3 gap-8">
        <div>
          <label className="font-medium text-gray-900 mt-10">
            프로젝트 이름<span className="pl-1 text-red-600">*</span>
          </label>
          <TextField
            value={name}
            onChange={handleChangeName}
            errorMessage={errorMessages["name"]}
            placeholder="이름을 입력하세요"
          />
        </div>
        <div>
          <label className="font-medium text-gray-900 mt-7">
            프로젝트 설명<span className="pl-1 text-red-600">*</span>
          </label>
          <TextField
            value={description}
            onChange={handleChangeDescription}
            errorMessage={errorMessages["description"]}
            placeholder="설명을 입력하세요"
          />
        </div>
        <div>
          <label className="font-medium text-gray-900 mt-7">마감일</label>
          <CustomSingleDatePicker value={endDate} onChange={handleChangeDate} />
        </div>
      </div>
    </div>
  );
};

export default CreateProjectForm;
