import { api } from "../api";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    apiTokensControllerCreate: build.mutation<
      ApiTokensControllerCreateApiResponse,
      ApiTokensControllerCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin/api-tokens`,
        method: "POST",
        body: queryArg.createApiTokenDto,
      }),
    }),
    apiTokensControllerFindAll: build.query<
      ApiTokensControllerFindAllApiResponse,
      ApiTokensControllerFindAllApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin/api-tokens`,
        params: {
          take: queryArg.take,
          skip: queryArg.skip,
          filter: queryArg.filter,
        },
      }),
    }),
    apiTokensControllerFindOne: build.query<
      ApiTokensControllerFindOneApiResponse,
      ApiTokensControllerFindOneApiArg
    >({
      query: (queryArg) => ({ url: `/api/admin/api-tokens/${queryArg.id}` }),
    }),
    apiTokensControllerRegenerate: build.mutation<
      ApiTokensControllerRegenerateApiResponse,
      ApiTokensControllerRegenerateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin/api-tokens/${queryArg.id}/regenerate`,
        method: "POST",
      }),
    }),
    apiTokensControllerUpdate: build.mutation<
      ApiTokensControllerUpdateApiResponse,
      ApiTokensControllerUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin/api-tokens/${queryArg.id}`,
        method: "PATCH",
        body: queryArg.updateApiTokenDto,
      }),
    }),
    apiTokensControllerRemove: build.mutation<
      ApiTokensControllerRemoveApiResponse,
      ApiTokensControllerRemoveApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin/api-tokens/${queryArg.id}`,
        method: "DELETE",
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as api };
export type ApiTokensControllerCreateApiResponse = {
  plainToken?: string;
  id: number;
  name: string;
};
export type ApiTokensControllerCreateApiArg = {
  createApiTokenDto: CreateApiTokenDto;
};
export type ApiTokensControllerFindAllApiResponse = unknown;
export type ApiTokensControllerFindAllApiArg = {
  take: number;
  skip: number;
  filter?: string;
};
export type ApiTokensControllerFindOneApiResponse = {
  plainToken?: string;
  id: number;
  name: string;
  project?: { code?: string };
  environment?: { code?: string };
};
export type ApiTokensControllerFindOneApiArg = {
  id: number;
};
export type ApiTokensControllerRegenerateApiResponse =
  ApiTokensControllerFindOneApiResponse;
export type ApiTokensControllerRegenerateApiArg = {
  id: number;
};
export type ApiTokensControllerUpdateApiResponse = unknown;
export type ApiTokensControllerUpdateApiArg = {
  id: number;
  updateApiTokenDto: UpdateApiTokenDto;
};
export type ApiTokensControllerRemoveApiResponse = unknown;
export type ApiTokensControllerRemoveApiArg = {
  id: number;
};
export type CreateApiTokenDto = {
  name: string;
  environmentId: number;
  isActive: boolean;
};
export type UpdateApiTokenDto = {
  name?: string;
  environmentId?: number;
  isActive?: boolean;
};
export const {
  useApiTokensControllerCreateMutation,
  useApiTokensControllerFindAllQuery,
  useApiTokensControllerFindOneQuery,
  useApiTokensControllerRegenerateMutation,
  useApiTokensControllerUpdateMutation,
  useApiTokensControllerRemoveMutation,
} = injectedRtkApi;
