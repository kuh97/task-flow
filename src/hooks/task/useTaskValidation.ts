import { useState } from "react";
import { ErrorMessage, FormData } from "@/components/kanbanBoard/TaskForm";

export const useTaskValidation = () => {
  const [errorMsg, setErrorMsg] = useState<ErrorMessage>({});

  const validationCheck = (formData: FormData) => {
    const { name, startDate, endDate } = formData;

    let hasError = false;
    if (!name || name.trim() === "") {
      setErrorMsg((prev) => ({
        ...prev,
        ["name"]: "제목을 입력해주세요",
      }));
      hasError = true;
    }

    let dateErrorMsg = "";
    if (!startDate || startDate.trim() === "") {
      dateErrorMsg += "시작일";
    }
    if (!endDate || endDate.trim() === "") {
      if (dateErrorMsg !== "") {
        dateErrorMsg += "/마감일을 선택해주세요";
      } else {
        dateErrorMsg += "마감일을 선택해주세요";
      }
    }
    if (dateErrorMsg !== "") {
      setErrorMsg((prev) => ({
        ...prev,
        ["date"]: dateErrorMsg,
      }));
      hasError = true;
    }

    if (hasError) return false;

    return true;
  };

  const resetErrors = () => setErrorMsg({});

  // 특정 필드의 에러 메시지 초기화
  const clearFieldError = (field: string) => {
    setErrorMsg((prev) =>
      Object.fromEntries(Object.entries(prev).filter(([key]) => key !== field))
    );
  };

  return { errorMsg, resetErrors, clearFieldError, validationCheck };
};
