import Role from "./Role";

export default interface Member {
  id: string;
  email: string;
  nickname: string;
  isActive: boolean;
  profileImage: string;
  role?: Role;
}
