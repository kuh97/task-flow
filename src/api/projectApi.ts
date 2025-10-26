import client from "./graphqlClient";
import {
  CREATE_MEMBER_FROM_PROJECT,
  CREATE_PROJECT,
  DELETE_PROJECT,
  GET_PROJECT_BY_ID,
  GET_PROJECTS,
  REMOVE_MEMBER_FROM_PROJECT,
  UPDATE_PROJECT,
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

interface UpdateProjectResponse {
  updateProject: ProjectBasic;
}

/**
 * 프로젝트 수정 API
 * @param newProject - 수정할 프로젝트 데이터
 * @returns 수정된 프로젝트 정보
 */
export const updateProject = async (
  newProject: ProjectBasic
): Promise<UpdateProjectResponse> => {
  const variables = {
    id: newProject.id,
    name: newProject.name,
    description: newProject.description,
  };

  return client.request<UpdateProjectResponse>(UPDATE_PROJECT, variables);
};

interface DeleteProjectResponse {
  deleteProject: ProjectBasic;
}

/**
 * 프로젝트 삭제 api
 * @param name
 * @param description
 * @returns ProjectBasic
 */
export const deleteProject = async (
  deleteProject: ProjectBasic
): Promise<DeleteProjectResponse> => {
  const variables = {
    id: deleteProject.id,
  };

  return client.request(DELETE_PROJECT, variables);
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
