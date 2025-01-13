import { create } from "zustand";
import Project from "@models/Project";
import Task from "@models/Task";
import Member from "@models/Member";

interface ProjectStore {
  projects: Project[];
  // 기본 CRUD 작업
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;

  // 프로젝트 관련 작업
  updateProgress: (id: string, progress: number) => void;
  addMember: (projectId: string, member: Member) => void;
  removeMember: (projectId: string, memberId: string) => void;

  // 작업(Task) 관련
  addTask: (projectId: string, task: Task) => void;
  updateTask: (projectId: string, taskId: string, task: Partial<Task>) => void;
  deleteTask: (projectId: string, taskId: string) => void;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],

  setProjects: (projects) => set({ projects }),

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
