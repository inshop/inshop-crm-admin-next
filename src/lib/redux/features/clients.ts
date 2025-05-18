import { api } from "../api";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    clientsControllerCreate: build.mutation<
      ClientsControllerCreateApiResponse,
      ClientsControllerCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin/clients`,
        method: "POST",
        body: queryArg.createClientDto,
      }),
    }),
    clientsControllerFindAll: build.query<
      ClientsControllerFindAllApiResponse,
      ClientsControllerFindAllApiArg
    >({
      query: (queryArg) => ({ url: `/api/admin/clients` }),
    }),
    clientsControllerFindOne: build.query<
      ClientsControllerFindOneApiResponse,
      ClientsControllerFindOneApiArg
    >({
      query: (queryArg) => ({ url: `/api/admin/clients/${queryArg.id}` }),
    }),
    clientsControllerUpdate: build.mutation<
      ClientsControllerUpdateApiResponse,
      ClientsControllerUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin/clients/${queryArg.id}`,
        method: "PATCH",
        body: queryArg.updateClientDto,
      }),
    }),
    clientsControllerRemove: build.mutation<
      ClientsControllerRemoveApiResponse,
      ClientsControllerRemoveApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin/clients/${queryArg.id}`,
        method: "DELETE",
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as api };
export type ClientsControllerCreateApiResponse = unknown;
export type ClientsControllerCreateApiArg = {
  createClientDto: CreateClientDto;
};
export type ClientsControllerFindAllApiResponse = unknown;
export type ClientsControllerFindAllApiArg = {
  take: number;
  skip: number;
};
export type ClientsControllerFindOneApiResponse = unknown;
export type ClientsControllerFindOneApiArg = {
  id: Client;
};
export type ClientsControllerUpdateApiResponse = unknown;
export type ClientsControllerUpdateApiArg = {
  id: Client;
  updateClientDto: UpdateClientDto;
};
export type ClientsControllerRemoveApiResponse = unknown;
export type ClientsControllerRemoveApiArg = {
  id: Client;
};
export type CreateClientDto = {
  name: string;
  email: string;
  password: string;
};
export type Client = {};
export type UpdateClientDto = {
  name: string;
  email: string;
  password: string;
};
export const {
  useClientsControllerCreateMutation,
  useClientsControllerFindAllQuery,
  useClientsControllerFindOneQuery,
  useClientsControllerUpdateMutation,
  useClientsControllerRemoveMutation,
} = injectedRtkApi;
