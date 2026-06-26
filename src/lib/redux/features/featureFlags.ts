import { api } from "../api";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    featureFlagsControllerCreate: build.mutation<
      FeatureFlagsControllerCreateApiResponse,
      FeatureFlagsControllerCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin/feature-flags`,
        method: "POST",
        body: queryArg.createFeatureFlagDto,
      }),
    }),
    featureFlagsControllerFindAll: build.query<
      FeatureFlagsControllerFindAllApiResponse,
      FeatureFlagsControllerFindAllApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin/feature-flags`,
        params: {
          take: queryArg.take,
          skip: queryArg.skip,
          filter: queryArg.filter,
        },
      }),
    }),
    featureFlagsControllerFindOne: build.query<
      FeatureFlagsControllerFindOneApiResponse,
      FeatureFlagsControllerFindOneApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin/feature-flags/${queryArg.id}`,
      }),
    }),
    featureFlagsControllerUpdate: build.mutation<
      FeatureFlagsControllerUpdateApiResponse,
      FeatureFlagsControllerUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin/feature-flags/${queryArg.id}`,
        method: "PATCH",
        body: queryArg.updateFeatureFlagDto,
      }),
    }),
    featureFlagsControllerUpdateEnvironmentValue: build.mutation<
      FeatureFlagsControllerUpdateEnvironmentValueApiResponse,
      FeatureFlagsControllerUpdateEnvironmentValueApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin/feature-flags/${queryArg.id}/environments/${queryArg.environmentId}`,
        method: "PATCH",
        body: queryArg.updateFeatureFlagEnvironmentValueDto,
      }),
    }),
    featureFlagsControllerRemove: build.mutation<
      FeatureFlagsControllerRemoveApiResponse,
      FeatureFlagsControllerRemoveApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin/feature-flags/${queryArg.id}`,
        method: "DELETE",
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as api };

export type FeatureFlagEnvironmentValueDto = {
  environmentId: number;
  enabled: boolean;
};

export type CreateFeatureFlagDto = {
  name: string;
  code: string;
  expiresAt: string;
  projectIds: number[];
  environmentValues?: FeatureFlagEnvironmentValueDto[];
};

export type UpdateFeatureFlagDto = {
  name?: string;
  code?: string;
  expiresAt?: string | null;
  projectIds?: number[];
  environmentValues?: FeatureFlagEnvironmentValueDto[];
};

export type UpdateFeatureFlagEnvironmentValueDto = {
  enabled: boolean;
};

export type Project = {
  id: number;
  name: string;
  code: string;
};

export type Environment = {
  id: number;
  name: string;
  code: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
};

export type FeatureFlagEnvironmentValue = {
  id: number;
  enabled: boolean;
  environment: Environment;
};

export type FeatureFlag = {
  id: number;
  name: string;
  code: string;
  expiresAt?: string | null;
  createdBy: User;
  projects: Project[];
  environmentValues: FeatureFlagEnvironmentValue[];
};

export type FeatureFlagsControllerCreateApiResponse = FeatureFlag;
export type FeatureFlagsControllerCreateApiArg = {
  createFeatureFlagDto: CreateFeatureFlagDto;
};
export type FeatureFlagsControllerFindAllApiResponse = [FeatureFlag[], number];
export type FeatureFlagsControllerFindAllApiArg = {
  take: number;
  skip: number;
  filter?: string;
};
export type FeatureFlagsControllerFindOneApiResponse = FeatureFlag;
export type FeatureFlagsControllerFindOneApiArg = {
  id: number;
};
export type FeatureFlagsControllerUpdateApiResponse = FeatureFlag;
export type FeatureFlagsControllerUpdateApiArg = {
  id: number;
  updateFeatureFlagDto: UpdateFeatureFlagDto;
};
export type FeatureFlagsControllerUpdateEnvironmentValueApiResponse =
  FeatureFlagEnvironmentValue;
export type FeatureFlagsControllerUpdateEnvironmentValueApiArg = {
  id: number;
  environmentId: number;
  updateFeatureFlagEnvironmentValueDto: UpdateFeatureFlagEnvironmentValueDto;
};
export type FeatureFlagsControllerRemoveApiResponse = unknown;
export type FeatureFlagsControllerRemoveApiArg = {
  id: number;
};

export const {
  useFeatureFlagsControllerCreateMutation,
  useFeatureFlagsControllerFindAllQuery,
  useFeatureFlagsControllerFindOneQuery,
  useFeatureFlagsControllerUpdateMutation,
  useFeatureFlagsControllerUpdateEnvironmentValueMutation,
  useFeatureFlagsControllerRemoveMutation,
} = injectedRtkApi;
