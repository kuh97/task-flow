import React from "react";
import Member from "@models/Member";

const colors = [
  ["#e6e4c7", "#f5f5dc"], // 연베이지
  ["#d1d1d1", "#e5e5e5"], // 연회색
  ["#b4b9c1", "#d1d5db"], // 연그레이
  ["#e7d8c9", "#f1e1d5"], // 연브라운
  ["#bbccbb", "#d1f0cf"], // 연그린
  ["#d0d6a3", "#e2e9c7"], // 연카키
  ["#c3d9e0", "#d1e7f2"], // 연청색
  ["#f3eabb", "#eeecc4"], // 연아이보리
  ["#d8d0c4", "#ebe3d9"], // 회색빛 베이지
  ["#f5d6c9", "#f1e0d6"], // 연소라
  ["#f2d1d1", "#e7d1d1"], // 연핑크
  ["#d8c7d6", "#f2e7f0"], // 연라벤더
  ["#eddbbb", "#f8e0b3"], // 연피치
];

interface MemeberBadgeProps {
  members: Member[];
}

const MemberBadge = ({ members }: MemeberBadgeProps) => {
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  return (
    <div className="flex">
      <div
        className={`flex w-[37px] h-[37px] border-box p-4 justify-center items-center rounded-full text-white/75 font-bold border border-white z-20`}
        style={{ backgroundColor: randomColor[0] }}
      >
        {members[0].nickname.slice(0, 2).toUpperCase()}
      </div>
      {members.length > 1 && (
        <div
          className={`flex w-[37px] h-[37px] border-box p-4 justify-center items-center rounded-full text-white border border-white text-xs ml-[-12px] z-10`}
          style={{ backgroundColor: randomColor[1] }}
        >
          {`+${members.length - 1}`}
        </div>
      )}
    </div>
  );
};

export default React.memo(MemberBadge);
