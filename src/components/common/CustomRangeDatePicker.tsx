import { forwardRef } from "react";
import { ko } from "date-fns/locale";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./CustomRangeDatePicker.css";
import Icon from "@common/icon/Icon";

interface CustomRangeDatePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChangeStart: (date: Date | null) => void;
  onChangeEnd: (date: Date | null) => void;
  errorMessage?: string;
  onBlur?: () => void;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  mustSelectFullRange?: boolean;
  minDate?: Date | undefined;
  maxDate?: Date | undefined;
}

const CustomRangeDatePicker = ({
  startDate,
  endDate,
  onChangeStart,
  onChangeEnd,
  errorMessage,
  onBlur,
  isOpen = false,
  onOpenChange,
  mustSelectFullRange = false,
  minDate,
  maxDate,
}: CustomRangeDatePickerProps) => {
  const handleDateChange = (dates: [Date | null, Date | null]) => {
    if (dates) {
      const [start, end] = dates;
      onChangeStart(start);
      onChangeEnd(end);

      if (mustSelectFullRange && (!start || !end)) {
        onOpenChange?.(true);
      }
    }
  };

  const handleBlur = () => {
    if (mustSelectFullRange && (!startDate || !endDate)) {
      onOpenChange?.(true);
      if (onBlur) onBlur();
    } else {
      onOpenChange?.(false);
    }
  };

  return (
    <div className="w-full">
      <DatePicker
        selectsRange
        selected={startDate}
        onChange={handleDateChange}
        startDate={startDate || undefined}
        endDate={endDate || undefined}
        minDate={minDate}
        maxDate={maxDate}
        dateFormat="yyyy.MM.dd"
        placeholderText="날짜를 선택하세요"
        popperPlacement="bottom"
        showPopperArrow={false}
        locale={ko}
        calendarClassName={`bg-white border rounded-lg shadow-lg ${mustSelectFullRange && errorMessage && "mt-4"}`}
        customInput={<CustomInput errorMessage={errorMessage} />}
        disabledKeyboardNavigation
        onClickOutside={handleBlur}
        open={isOpen}
        onInputClick={() => onOpenChange?.(true)}
      />
      {errorMessage && (
        <span className="text-xs text-red-600">{errorMessage}</span>
      )}
    </div>
  );
};

const CustomInput = forwardRef(({ errorMessage, ...props }: any, ref) => {
  const hasValue = props.value;

  return (
    <div className="relative w-full">
      <input
        {...props}
        className={`w-full h-10 p-2 mt-2 text-sm font-normal text-gray-900 
          border-[1.5px] ${errorMessage ? "border-red-400" : "border-gray-300"} rounded-md 
          hover:border-gray-400 focus:outline-none focus:border-indigo-600
        `}
        ref={ref}
        type="text"
        readOnly
      />
      <div className="absolute right-[7px] top-[17px]">
        {hasValue ? (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              props.onChange([null, null]);
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <Icon name={"deleteButton"} className={"w-5 h-5"} />
          </button>
        ) : (
          <CalendarIcon className="" />
        )}
      </div>
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

export default CustomRangeDatePicker;
