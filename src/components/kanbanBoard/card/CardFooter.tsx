import { format, formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale/ko";

interface CardFooterProps {
  startDate: string;
  endDate: string;
}

const CardFooter = ({ startDate, endDate }: CardFooterProps) => {
  return (
    <div className="flex items-center h-[30px]">
      <div className="flex px-2 py-[2px] mr-3 bg-[#f1f1f1] rounded-full">
        <CalendarIcon className="w-[17px] h-[17px] mr-1" />
        <span className="text-[0.7rem] text-[#929dac]">
          {format(startDate, "MM-dd")}
        </span>
      </div>
      <div className="flex px-2 py-[2px] bg-[#f1f1f1] rounded-full">
        <TimeIcon className="w-[16px] h-[16px] mr-1" />
        <span className="text-[0.7rem] text-[#929dac]">
          {formatDistanceToNow(endDate, { locale: ko })}
        </span>
      </div>
    </div>
  );
};

const CalendarIcon = ({ className }: { className: string }) => {
  return (
    <svg fill="none" viewBox="0 0 24 24" className={className}>
      <path
        d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z"
        stroke="#a0aec0" // 연한 회색으로 변경
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};

const TimeIcon = ({ className }: { className: string }) => {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path
        fill="#a0aec0"
        d="M12,0A12,12,0,1,0,24,12,12.013,12.013,0,0,0,12,0Zm0,22A10,10,0,1,1,22,12,10.011,10.011,0,0,1,12,22Z"
      />
      <path
        fill="#a0aec0"
        d="M13,11.586V6a1,1,0,0,0-2,0v6a1,1,0,0,0,.293.707l3,3a1,1,0,0,0,1.414-1.414Z"
      />
    </svg>
  );
};

export default CardFooter;
