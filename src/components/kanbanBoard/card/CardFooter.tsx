import Task from "@models/Task";
import { format, formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale/ko";
import CalendarIcon from "@components/common/icon/CalendarIcon";

interface CardFooterProps {
  startDate: string;
  endDate: string;
  subTasks?: Task[];
}

const CardFooter = ({ startDate, endDate, subTasks = [] }: CardFooterProps) => {
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
      {subTasks.length > 0 && (
        <div className="flex px-2 py-[2px] ml-auto bg-[#f1f1f1] rounded-full">
          <SubTaskIcon className="w-[16px] h-[16px] mr-1" />
          <span className="text-[0.7rem] text-[#929dac]">
            {`${subTasks.filter((s) => s.status === "Done").length}/${subTasks.length}`}
          </span>
        </div>
      )}
    </div>
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

const SubTaskIcon = ({ className }: { className: string }) => {
  return (
    <svg fill="none" viewBox="0 0 24 24" className={className}>
      <path
        fill="#a0aec0"
        d="M13.25 8.5C12.8358 8.5 12.5 8.83579 12.5 9.25C12.5 9.66421 12.8358 10 13.25 10H16.75C17.1642 10 17.5 9.66421 17.5 9.25C17.5 8.83579 17.1642 8.5 16.75 8.5H13.25ZM12.5001 14.75C12.5001 14.3358 12.8358 14 13.2501 14H16.7499C17.1642 14 17.4999 14.3358 17.4999 14.75C17.4999 15.1642 17.1642 15.5 16.7499 15.5H13.2501C12.8358 15.5 12.5001 15.1642 12.5001 14.75ZM10.7803 7.71967C11.0732 8.01256 11.0732 8.48744 10.7803 8.78033L8.78033 10.7803C8.48744 11.0732 8.01256 11.0732 7.71967 10.7803L6.71967 9.78033C6.42678 9.48744 6.42678 9.01256 6.71967 8.71967C7.01256 8.42678 7.48744 8.42678 7.78033 8.71967L8.25 9.18934L9.71967 7.71967C10.0126 7.42678 10.4874 7.42678 10.7803 7.71967ZM10.7803 14.2803C11.0732 13.9874 11.0732 13.5126 10.7803 13.2197C10.4874 12.9268 10.0126 12.9268 9.71967 13.2197L8.25 14.6893L7.78033 14.2197C7.48744 13.9268 7.01256 13.9268 6.71967 14.2197C6.42678 14.5126 6.42678 14.9874 6.71967 15.2803L7.71967 16.2803C8.01256 16.5732 8.48744 16.5732 8.78033 16.2803L10.7803 14.2803ZM5.25 3C4.00736 3 3 4.00736 3 5.25V18.75C3 19.9926 4.00736 21 5.25 21H18.75C19.9926 21 21 19.9926 21 18.75V5.25C21 4.00736 19.9926 3 18.75 3H5.25ZM4.5 5.25C4.5 4.83579 4.83579 4.5 5.25 4.5H18.75C19.1642 4.5 19.5 4.83579 19.5 5.25V18.75C19.5 19.1642 19.1642 19.5 18.75 19.5H5.25C4.83579 19.5 4.5 19.1642 4.5 18.75V5.25Z"
      />
    </svg>
  );
};

export default CardFooter;
