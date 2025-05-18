import { api } from "../api";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    authControllerLogin: build.mutation<
      AuthControllerLoginApiResponse,
      AuthControllerLoginApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin/auth/login`,
        method: "POST",
        body: queryArg.loginAuthDto,
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as api };
export type AuthControllerLoginApiResponse = unknown;
export type AuthControllerLoginApiArg = {
  loginAuthDto: LoginAuthDto;
};
export type LoginAuthDto = {
  email: string;
  password: string;
};
export const { useAuthControllerLoginMutation } = injectedRtkApi;
