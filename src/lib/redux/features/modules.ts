import { api } from "../api";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    modulesControllerCreate: build.mutation<
      ModulesControllerCreateApiResponse,
      ModulesControllerCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin/modules`,
        method: "POST",
        body: queryArg.createModuleDto,
      }),
    }),
    modulesControllerFindAll: build.query<
      ModulesControllerFindAllApiResponse,
      ModulesControllerFindAllApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin/modules`,
        params: {
          take: queryArg.take,
          skip: queryArg.skip,
        },
      }),
    }),
    modulesControllerFindOne: build.query<
      ModulesControllerFindOneApiResponse,
      ModulesControllerFindOneApiArg
    >({
      query: (queryArg) => ({ url: `/api/admin/modules/${queryArg.id}` }),
    }),
    modulesControllerUpdate: build.mutation<
      ModulesControllerUpdateApiResponse,
      ModulesControllerUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin/modules/${queryArg.id}`,
        method: "PATCH",
        body: queryArg.updateModuleDto,
      }),
    }),
    modulesControllerRemove: build.mutation<
      ModulesControllerRemoveApiResponse,
      ModulesControllerRemoveApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin/modules/${queryArg.id}`,
        method: "DELETE",
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as api };
export type ModulesControllerCreateApiResponse = unknown;
export type ModulesControllerCreateApiArg = {
  createModuleDto: CreateModuleDto;
};
export type ModulesControllerFindAllApiResponse = unknown;
export type ModulesControllerFindAllApiArg = {
  take: number;
  skip: number;
};
export type ModulesControllerFindOneApiResponse = unknown;
export type ModulesControllerFindOneApiArg = {
  id: Module;
};
export type ModulesControllerUpdateApiResponse = unknown;
export type ModulesControllerUpdateApiArg = {
  id: Module;
  updateModuleDto: UpdateModuleDto;
};
export type ModulesControllerRemoveApiResponse = unknown;
export type ModulesControllerRemoveApiArg = {
  id: Module;
};
export type CreateModuleDto = {
  name: string;
};
export type Module = {};
export type UpdateModuleDto = {
  name: string;
};
export const {
  useModulesControllerCreateMutation,
  useModulesControllerFindAllQuery,
  useModulesControllerFindOneQuery,
  useModulesControllerUpdateMutation,
  useModulesControllerRemoveMutation,
} = injectedRtkApi;
