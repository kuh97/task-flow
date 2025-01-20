import { GRAPHQL_ENDPOINT } from "@/config/graphql";
import { GraphQLClient } from "graphql-request";
import {
  CREATE_PROJECT,
  GET_PROJECT_BY_ID,
  GET_PROJECTS,
} from "@queries/projectQueries";
import Project, { ProjectBasic } from "@models/Project";
import { convertProjectDates } from "@/utils/convertDateFormat";

const client = new GraphQLClient(GRAPHQL_ENDPOINT);

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
