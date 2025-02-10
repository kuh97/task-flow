import Member from "@/models/Member";
import { useState } from "react";
import KebabMenu from "@components/common/KebabMenu";
import { useAuthStore } from "@/store/authStore";

const User = ({ user }: { user: Member }) => {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const { logout } = useAuthStore();

  const menuItems = [
    {
      label: "계정 관리",
      onClick: () => console.log("계정 관리"),
    },
    {
      label: "로그아웃",
      onClick: () => logout(),
    },
  ];

  const handleClickUser = () => {
    setOpenMenu((prev) => !prev);
  };

  return (
    <>
      <button
        className={`flex w-[30px] h-[30px] border-box ml-auto justify-center items-center rounded-full overflow-hidden outline-none`}
        onClick={handleClickUser}
      >
        <img
          src={user.profileImage}
          alt={"user-profile"}
          width={30}
          height={30}
        />
      </button>
      {openMenu && (
        <KebabMenu menuItems={menuItems} onClose={() => setOpenMenu(false)} />
      )}
    </>
  );
};

export default User;
