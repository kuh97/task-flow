import { useAppStore } from "@/store/useAppStore";
import User from "./User";
import { format } from "date-fns";
import CalendarIcon from "@common/icon/CalendarIcon";
import { useEffect, useState } from "react";
import Logo from "./common/Logo";

interface StatusBarProps {
  projectName?: string;
  hideLogo?: boolean;
  hideGreeting?: boolean;
}

const StatusBar = ({
  projectName = "",
  hideLogo = false,
  hideGreeting = false,
}: StatusBarProps) => {
  // 로그인 정보 가져오기
  const { loginMember } = useAppStore();

  if (!loginMember) {
    return null;
  }

  const [hasBorder, setHasBorder] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasBorder(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`flex sticky top-0 h-[45px] px-5 py-2 items-center bg-[#fff] transition-all duration-300
                    ${hasBorder ? "border-b border-gray-300" : "border-b border-transparent"}`}
    >
      {!hideLogo && <Logo />}
      {!hideGreeting && (
        <span className="text-sm cursor-default">{`안녕하세요. ${loginMember?.nickname}님 😊`}</span>
      )}
      <span className="ml-auto font-semibold cursor-default">
        {projectName}
      </span>
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
