import { create } from "zustand";
import Project from "@models/Project";
import Task from "@models/Task";
import Member from "@models/Member";

interface ProjectStore {
  projects: Project[];
  // 기본 CRUD 작업
  addProject: (project: Project) => void;
  updateProject: (id: number, project: Partial<Project>) => void;
  deleteProject: (id: number) => void;
  getProject: (id: number) => Project | undefined;

  // 프로젝트 관련 작업
  updateProgress: (id: number, progress: number) => void;
  addMember: (projectId: number, member: Member) => void;
  removeMember: (projectId: number, memberId: number) => void;

  // 작업(Task) 관련
  addTask: (projectId: number, task: Task) => void;
  updateTask: (projectId: number, taskId: number, task: Partial<Task>) => void;
  deleteTask: (projectId: number, taskId: number) => void;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [
    {
      id: 1,
      name: "방가방가 프로젝트",
      description: "1번 입니당",
      createdAt: "2024-12-03",
      progress: 0,
      members: [],
      tasks: [],
    },
    {
      id: 2,
      name: "하이루 프로젝트",
      description: "2번 입니당",
      createdAt: "2024-10-12",
      progress: 50,
      members: [],
      endDate: "2025-06-03",
      tasks: [],
    },
    {
      id: 3,
      name: "머선 프로젝트",
      description: "3번 입니당",
      createdAt: "2023-01-20",
      progress: 90,
      members: [],
      tasks: [],
    },
  ],

  addProject: (project) =>
    set((state) => ({
      projects: [...state.projects, project],
    })),

  updateProject: (id, updatedProject) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === id ? { ...project, ...updatedProject } : project
      ),
    })),

  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((project) => project.id !== id),
    })),

  getProject: (id) => get().projects.find((project) => project.id === id),

  updateProgress: (id, progress) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === id ? { ...project, progress } : project
      ),
    })),

  addMember: (projectId, member) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId
          ? { ...project, members: [...project.members, member] }
          : project
      ),
    })),

  removeMember: (projectId, memberId) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              members: project.members.filter(
                (member) => member.id !== memberId
              ),
            }
          : project
      ),
    })),

  addTask: (projectId, task) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId
          ? { ...project, tasks: [...project.tasks, task] }
          : project
      ),
    })),

  updateTask: (projectId, taskId, updatedTask) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.map((task) =>
                task.id === taskId ? { ...task, ...updatedTask } : task
              ),
            }
          : project
      ),
    })),

  deleteTask: (projectId, taskId) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.filter((task) => task.id !== taskId),
            }
          : project
      ),
    })),
}));
