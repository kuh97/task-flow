import React from "react";
import Member from "@/models/Member";
import MemberBadge from "@components/kanbanBoard/card/MemberBadge";

interface CardHeaderProps {
  name: string;
  managers: Member[];
}

const CardHeader = ({ name, managers }: CardHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-2">
      <span className="text-[0.9rem] font-semibold">{name}</span>
      <MemberBadge members={managers} />
    </div>
  );
};

export default React.memo(CardHeader);
