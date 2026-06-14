import { api } from "../api";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    auditsControllerFindAll: build.query<
      AuditsControllerFindAllApiResponse,
      AuditsControllerFindAllApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin/audits`,
        params: {
          take: queryArg.take,
          skip: queryArg.skip,
          filter: queryArg.filter,
        },
      }),
    }),
    auditsControllerFindOne: build.query<
      AuditsControllerFindOneApiResponse,
      AuditsControllerFindOneApiArg
    >({
      query: (queryArg) => ({ url: `/api/admin/audits/${queryArg.id}` }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as api };
export type AuditsControllerFindAllApiResponse = unknown;
export type AuditsControllerFindAllApiArg = {
  take: number;
  skip: number;
  filter?: string;
};
export type AuditsControllerFindOneApiResponse = unknown;
export type AuditsControllerFindOneApiArg = {
  id: number;
};
export const {
  useAuditsControllerFindAllQuery,
  useAuditsControllerFindOneQuery,
} = injectedRtkApi;
