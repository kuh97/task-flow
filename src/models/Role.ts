export default interface Role {
  id: string;
  name: string;
  permissions: string[];
  projectId: string;
  memberId: string;
}
