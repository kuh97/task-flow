import client from "./graphqlClient";
import {
  CREATE_MEMBER_FROM_PROJECT,
  CREATE_PROJECT,
  GET_PROJECT_BY_ID,
  GET_PROJECTS,
  REMOVE_MEMBER_FROM_PROJECT,
} from "@queries/projectQueries";
import Project, { ProjectBasic } from "@models/Project";
import { convertProjectDates } from "@/utils/convertDateFormat";
import Member from "@/models/Member";
import Role from "@/models/Role";

interface GetProjectByIdResponse {
  getProjectById: Project;
}

/**
 * 프로젝트 fetch by Id
 * @returns Project
 */
export const fetchProjectById = async (
  id: string
): Promise<GetProjectByIdResponse> => {
  const variables = {
    id,
  };
  const response = await client.request<GetProjectByIdResponse>(
    GET_PROJECT_BY_ID,
    variables
  );

  if (response.getProjectById) {
    response.getProjectById = convertProjectDates(response.getProjectById);
  }

  return response;
};

interface GetProjectsResponse {
  getProjects: ProjectBasic[];
}

/**
 * 프로젝트 fetch all
 * @returns ProjectBasic[]
 */
export const fetchProjects = async (): Promise<GetProjectsResponse> => {
  return client.request(GET_PROJECTS);
};

interface CreateProjectResponse {
  createProject: ProjectBasic;
}

/**
 * 프로젝트 생성 api
 * @param name
 * @param description
 * @returns ProjectBasic
 */
export const createProject = async (
  newProject: ProjectBasic
): Promise<CreateProjectResponse> => {
  const variables = {
    name: newProject.name,
    description: newProject.description,
    endDate: newProject.endDate === "" ? null : newProject.endDate,
  };

  return client.request(CREATE_PROJECT, variables);
};

/**
 * 프로젝트 멤버 추가 api
 */
export const createMemberFromProject = async (
  email: string,
  name: string, // role name
  permissions: string[],
  projectId: string
): Promise<{ createMemberFromProject: { member: Member; role: Role } }> => {
  try {
    const variables = {
      email,
      name,
      permissions,
      projectId,
    };

    return await client.request(CREATE_MEMBER_FROM_PROJECT, variables);
  } catch (error) {
    console.log("멤버 초대 실패 (잘못된 이메일)", error);
    throw error;
  }
};

/**
 * 프로젝트 멤버 삭제 api
 */
export const removeMemberFromProject = async (
  projectId: string,
  memberId: string
): Promise<{ message: string }> => {
  const variables = { projectId: projectId, memberId: memberId };
  return client.request(REMOVE_MEMBER_FROM_PROJECT, variables);
};
