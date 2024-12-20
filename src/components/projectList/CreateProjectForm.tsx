import { useState } from "react";
import CustomDatePicker from "@components/common/CustomDataPicker";
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

function CreateProjectForm({
  setFormData,
  errorMessages,
  setErrorMsg,
}: CreateProjectFormProps) {
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
    if (date) {
      setEndDate(date);
      setFormData((prev) => ({
        ...prev,
        ["endDate"]: format(date, "yyyy-MM-dd"),
      }));
    }
  };

  return (
    <form className="flex flex-col w-[350px] h-auto">
      <label className="font-medium text-gray-900 mt-10">
        프로젝트 이름<span className="pl-1 text-red-600">*</span>
        <TextField
          value={name}
          onChange={handleChangeName}
          errorMessage={errorMessages["name"]}
        />
      </label>
      <label className="font-medium text-gray-900 mt-5">
        프로젝트 설명<span className="pl-1 text-red-600">*</span>
        <TextField
          value={description}
          onChange={handleChangeDescription}
          errorMessage={errorMessages["description"]}
        />
      </label>
      <label className="font-medium text-gray-900 mt-5">
        마감일
        <CustomDatePicker value={endDate} onChange={handleChangeDate} />
      </label>
    </form>
  );
}

export default CreateProjectForm;
