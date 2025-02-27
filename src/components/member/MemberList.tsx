import Dropdown, { Option } from "@/components/common/Dropdown";
import Icon from "../common/icon/Icon";
import Member from "@/models/Member";

interface MemberListProps {
  members: Member[];
  onPermissionChange: (member: Member, permission: string) => void;
  onDeleteMember: (member: Member) => void;
}

const MemberList = ({
  members,
  onPermissionChange,
  onDeleteMember,
}: MemberListProps) => {
  const ACCESS_OPTIONS: Option[] = [
    { label: "모든 권한", value: "ALL" },
    { label: "댓글 권한", value: "READ_AND_COMMENT" },
    { label: "조회 권한", value: "READONLY" },
  ];

  const getRoleDisplay = (role: string | undefined) => {
    switch (role) {
      case "ADMIN":
        return "관리자";
      case "GUEST":
        return "게스트";
      default:
        return "";
    }
  };

  return (
    <div className="rounded-lg max-h-[400px]">
      {members.map((member) => (
        <div
          key={member.id}
          className="flex items-center justify-between p-4 border-b last:border-b-0"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white">
              {member.profileImage ? (
                <img
                  src={member.profileImage}
                  alt={member.nickname}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                (member.nickname && member.nickname.charAt(0)) || "U"
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {member.nickname}{" "}
                  {member.email === "dmlgus911@gmail.com" && "(나)"}
                </span>
                <span className="text-amber-600 text-sm">
                  {getRoleDisplay(member.role?.name)}
                </span>
              </div>
              <div className="text-gray-500 text-sm">{member.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {member.email !== "dmlgus911@gmail.com" && (
              <>
                <div className="w-40">
                  <Dropdown
                    value={member.role?.permissions[0] ?? ""}
                    options={ACCESS_OPTIONS}
                    onChange={(value) => onPermissionChange(member, value)}
                    placeholder="권한 선택"
                  />
                </div>
                <button
                  onClick={() => onDeleteMember(member)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="멤버 삭제"
                >
                  <Icon name={"trash"} className={"w-6 h-6"} />
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MemberList;
