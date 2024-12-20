import { forwardRef } from "react";
import { ko } from "date-fns/locale";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./CustomDatePicker.css";

interface CustomDatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
}

function CustomDatePicker({ value, onChange }: CustomDatePickerProps) {
  return (
    <div className="w-full">
      <DatePicker
        selected={value}
        onChange={onChange}
        dateFormat="yyyy-MM-dd"
        placeholderText="날짜를 선택하세요"
        popperPlacement="bottom" // 달력 위치 조정
        showPopperArrow={false} // 화살표 제거
        locale={ko}
        minDate={new Date()} // 오늘 날짜 이후만 선택 가능
        calendarClassName="bg-white border rounded-lg shadow-lg"
        customInput={<CustomInput />}
      />
    </div>
  );
}

const CustomInput = forwardRef((props: any, ref) => {
  return (
    <div className="relative w-full">
      <input
        {...props}
        className="w-full h-10 p-2 mt-2 text-sm font-normal text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-600"
        ref={ref}
        type="text"
      />
      <CalendarIcon className="absolute right-[7px] top-[15px]" />
    </div>
  );
});

const CalendarIcon = ({ className }: { className: string }) => {
  return (
    <svg fill="none" height="24" width="24" className={className}>
      <path
        d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z"
        stroke="#4A5568"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};

export default CustomDatePicker;
