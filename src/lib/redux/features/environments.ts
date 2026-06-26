import { api } from "../api";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    environmentsControllerCreate: build.mutation<
      EnvironmentsControllerCreateApiResponse,
      EnvironmentsControllerCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin/environments`,
        method: "POST",
        body: queryArg.createEnvironmentDto,
      }),
    }),
    environmentsControllerFindAll: build.query<
      EnvironmentsControllerFindAllApiResponse,
      EnvironmentsControllerFindAllApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin/environments`,
        params: {
          take: queryArg.take,
          skip: queryArg.skip,
          filter: queryArg.filter,
        },
      }),
    }),
    environmentsControllerFindOne: build.query<
      EnvironmentsControllerFindOneApiResponse,
      EnvironmentsControllerFindOneApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin/environments/${queryArg.id}`,
      }),
    }),
    environmentsControllerUpdate: build.mutation<
      EnvironmentsControllerUpdateApiResponse,
      EnvironmentsControllerUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin/environments/${queryArg.id}`,
        method: "PATCH",
        body: queryArg.updateEnvironmentDto,
      }),
    }),
    environmentsControllerRemove: build.mutation<
      EnvironmentsControllerRemoveApiResponse,
      EnvironmentsControllerRemoveApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin/environments/${queryArg.id}`,
        method: "DELETE",
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as api };
export type EnvironmentsControllerCreateApiResponse = unknown;
export type EnvironmentsControllerCreateApiArg = {
  createEnvironmentDto: CreateEnvironmentDto;
};
export type EnvironmentsControllerFindAllApiResponse = unknown;
export type EnvironmentsControllerFindAllApiArg = {
  take: number;
  skip: number;
  filter?: string;
};
export type EnvironmentsControllerFindOneApiResponse = unknown;
export type EnvironmentsControllerFindOneApiArg = {
  id: Environment;
};
export type EnvironmentsControllerUpdateApiResponse = unknown;
export type EnvironmentsControllerUpdateApiArg = {
  id: Environment;
  updateEnvironmentDto: UpdateEnvironmentDto;
};
export type EnvironmentsControllerRemoveApiResponse = unknown;
export type EnvironmentsControllerRemoveApiArg = {
  id: Environment;
};
export type CreateEnvironmentDto = {
  name: string;
  code: string;
  isActive: boolean;
};
export type Environment = {};
export type UpdateEnvironmentDto = {
  name?: string;
  code?: string;
  isActive?: boolean;
};
export const {
  useEnvironmentsControllerCreateMutation,
  useEnvironmentsControllerFindAllQuery,
  useEnvironmentsControllerFindOneQuery,
  useEnvironmentsControllerUpdateMutation,
  useEnvironmentsControllerRemoveMutation,
} = injectedRtkApi;
