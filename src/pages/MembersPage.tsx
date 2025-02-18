import {
  useProjectData,
  useProjectMutations,
} from "@/hooks/project/useProjectMutation";
import { useProjectStore } from "@/store/useProjectStore";
import { useState } from "react";
import Dropdown, { Option } from "@/components/common/Dropdown";
import MemberList from "@/components/member/MemberList";
import Modal from "@/components/common/Modal";
import Member from "@/models/Member";
import TextField from "@/components/common/TextField";
import { useRoleMutations } from "@/hooks/role/useRoleMutation";

const PERMISSION_OPTIONS: Option[] = [
  { label: "모든 권한", value: "ALL" },
  { label: "댓글 권한", value: "READ_AND_COMMENT" },
  { label: "조회 권한", value: "READONLY" },
];

const MembersPage = () => {
  const { projectId } = useProjectStore();
  const { data: project } = useProjectData(projectId);
  if (project == null) {
    return null;
  }
  const [email, setEmail] = useState("");
  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const [selectedPermission, setSelectedPermission] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteMember, setIsDeleteMember] = useState<Member | null>(null);
  const { createMember, removeMember } = useProjectMutations({
    projectId: project.id,
  });
  const { updateRole } = useRoleMutations({ projectId: project.id });

  const handleInvite = async () => {
    if (!email.trim()) return;

    const emailRegex = /^[^\s@]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      setEmailErrorMsg("잘못된 메일 형식입니다. @gmail.com 형식이어야 합니다.");
      return;
    }

    const newMember = {
      email,
      permissions: [selectedPermission],
      projectId: project.id,
      name: selectedPermission === "READONLY" ? "GUEST" : "MEMBER",
    };
    createMember(newMember);
    setEmail("");
    setSelectedPermission("ALL");
    setEmailErrorMsg("");
  };

  const handlePermissionChange = (member: Member, permission: string) => {
    if (member.role) {
      let roleName = "MEMBER";
      if (permission === "READONLY") {
        roleName = "GUEST";
      }
      updateRole({
        id: member.role.id,
        name: roleName,
        permissions: [permission],
        projectId: project.id,
        memberId: member.id,
      });
    }
  };

  const handleDeleteMember = () => {
    if (isDeleteMember) {
      removeMember({ projectId: project.id, memberId: isDeleteMember.id });
      handleCloseModal();
    }
  };

  const handleDeleteModalOpen = (member: Member) => {
    setIsDeleteMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsDeleteMember(null);
  };

  const handleChangeEmail = (value: string) => {
    setEmail(value);
  };

  return (
    <>
      <div className="p-10 h-screen flex flex-col">
        <div className="bg-white rounded-lg p-6 flex flex-col flex-1">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 relative">
              <TextField
                value={email}
                onChange={handleChangeEmail}
                errorMessage={emailErrorMsg}
                placeholder={"이메일 주소를 입력하세요 (@gmail.com)"}
                className="!mt-0 h-12"
              />
            </div>
            <div className="w-40">
              <Dropdown
                value={selectedPermission}
                options={PERMISSION_OPTIONS}
                onChange={setSelectedPermission}
                placeholder="권한 선택"
              />
            </div>
            <button
              onClick={handleInvite}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              초대하기
            </button>
          </div>
          <hr className="mb-4" />
          <h3 className="text-gray-500 mb-4">{`프로젝트 구성원 (${project.members.length})`}</h3>
          <div className="flex-1 overflow-y-auto">
            <MemberList
              members={project.members}
              onPermissionChange={handlePermissionChange}
              onDeleteMember={handleDeleteModalOpen}
            />
          </div>
        </div>
      </div>
      <Modal
        title={"구성원 삭제"}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        buttonLabel={"삭제"}
        onClick={handleDeleteMember}
      >
        <p className="my-4">{`${isDeleteMember?.nickname} 구성원을 삭제하시겠습니까?`}</p>
      </Modal>
    </>
  );
};

export default MembersPage;
