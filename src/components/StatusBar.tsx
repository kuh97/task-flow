import { useAppStore } from "@/store/useAppStore";
import User from "./User";
import { format } from "date-fns";
import CalendarIcon from "@common/icon/CalendarIcon";

const StatusBar = () => {
  // 로그인 정보 가져오기
  const { loginMember } = useAppStore();

  if (!loginMember) {
    return null;
  }

  return (
    <div className="flex sticky top-0 ml-[252px] h-[45px] px-5 py-2 items-center bg-[#f5f5f5]">
      <span className="font-semibold cursor-default">{`안녕하세요. ${loginMember?.nickname}님 😊`}</span>
      <div className="flex items-center ml-auto">
        <CalendarIcon className="w-[20px] h-[20px] mr-1" />
        <span className="text-sm text-gray-dark mr-4 cursor-default">
          {format(new Date(), "M월 dd일, yyyy")}
        </span>
        <User user={loginMember} />
      </div>
    </div>
  );
};

export default StatusBar;
