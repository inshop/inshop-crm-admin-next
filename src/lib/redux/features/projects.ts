import { api } from "../api";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    projectsControllerCreate: build.mutation<
      ProjectsControllerCreateApiResponse,
      ProjectsControllerCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin/projects`,
        method: "POST",
        body: queryArg.createProjectDto,
      }),
    }),
    projectsControllerFindAll: build.query<
      ProjectsControllerFindAllApiResponse,
      ProjectsControllerFindAllApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin/projects`,
        params: {
          take: queryArg.take,
          skip: queryArg.skip,
          filter: queryArg.filter,
        },
      }),
    }),
    projectsControllerFindOne: build.query<
      ProjectsControllerFindOneApiResponse,
      ProjectsControllerFindOneApiArg
    >({
      query: (queryArg) => ({ url: `/api/admin/projects/${queryArg.id}` }),
    }),
    projectsControllerUpdate: build.mutation<
      ProjectsControllerUpdateApiResponse,
      ProjectsControllerUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin/projects/${queryArg.id}`,
        method: "PATCH",
        body: queryArg.updateProjectDto,
      }),
    }),
    projectsControllerRemove: build.mutation<
      ProjectsControllerRemoveApiResponse,
      ProjectsControllerRemoveApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin/projects/${queryArg.id}`,
        method: "DELETE",
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as api };
export type ProjectsControllerCreateApiResponse = unknown;
export type ProjectsControllerCreateApiArg = {
  createProjectDto: CreateProjectDto;
};
export type ProjectsControllerFindAllApiResponse = unknown;
export type ProjectsControllerFindAllApiArg = {
  take: number;
  skip: number;
  filter?: string;
};
export type ProjectsControllerFindOneApiResponse = unknown;
export type ProjectsControllerFindOneApiArg = {
  id: Project;
};
export type ProjectsControllerUpdateApiResponse = unknown;
export type ProjectsControllerUpdateApiArg = {
  id: Project;
  updateProjectDto: UpdateProjectDto;
};
export type ProjectsControllerRemoveApiResponse = unknown;
export type ProjectsControllerRemoveApiArg = {
  id: Project;
};
export type CreateProjectDto = {
  name: string;
  code: string;
  isActive: boolean;
};
export type Project = {};
export type UpdateProjectDto = {
  name?: string;
  code?: string;
  isActive?: boolean;
};
export const {
  useProjectsControllerCreateMutation,
  useProjectsControllerFindAllQuery,
  useProjectsControllerFindOneQuery,
  useProjectsControllerUpdateMutation,
  useProjectsControllerRemoveMutation,
} = injectedRtkApi;
