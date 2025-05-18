import { api } from "../api";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    rolesControllerCreate: build.mutation<
      RolesControllerCreateApiResponse,
      RolesControllerCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin/modules/${queryArg.moduleId}/roles`,
        method: "POST",
        body: queryArg.createRoleDto,
      }),
    }),
    rolesControllerFindAll: build.query<
      RolesControllerFindAllApiResponse,
      RolesControllerFindAllApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin/modules/${queryArg.moduleId}/roles`,
      }),
    }),
    rolesControllerFindOne: build.query<
      RolesControllerFindOneApiResponse,
      RolesControllerFindOneApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin/modules/${queryArg.moduleId}/roles/${queryArg.id}`,
      }),
    }),
    rolesControllerUpdate: build.mutation<
      RolesControllerUpdateApiResponse,
      RolesControllerUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin/modules/${queryArg.moduleId}/roles/${queryArg.id}`,
        method: "PATCH",
        body: queryArg.updateRoleDto,
      }),
    }),
    rolesControllerRemove: build.mutation<
      RolesControllerRemoveApiResponse,
      RolesControllerRemoveApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin/modules/${queryArg.moduleId}/roles/${queryArg.id}`,
        method: "DELETE",
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as api };
export type RolesControllerCreateApiResponse = unknown;
export type RolesControllerCreateApiArg = {
  moduleId: Module;
  createRoleDto: CreateRoleDto;
};
export type RolesControllerFindAllApiResponse = unknown;
export type RolesControllerFindAllApiArg = {
  moduleId: Module;
};
export type RolesControllerFindOneApiResponse = unknown;
export type RolesControllerFindOneApiArg = {
  moduleId: Module;
  id: Role;
};
export type RolesControllerUpdateApiResponse = unknown;
export type RolesControllerUpdateApiArg = {
  moduleId: Module;
  id: Role;
  updateRoleDto: UpdateRoleDto;
};
export type RolesControllerRemoveApiResponse = unknown;
export type RolesControllerRemoveApiArg = {
  moduleId: Module;
  id: Role;
};
export type Module = {};
export type CreateRoleDto = {
  name: string;
  role: string;
  module: Module;
};
export type Role = {};
export type UpdateRoleDto = {
  name: string;
  role: string;
  module: Module;
};
export const {
  useRolesControllerCreateMutation,
  useRolesControllerFindAllQuery,
  useRolesControllerFindOneQuery,
  useRolesControllerUpdateMutation,
  useRolesControllerRemoveMutation,
} = injectedRtkApi;
