import { api } from "../api";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    groupsControllerCreate: build.mutation<
      GroupsControllerCreateApiResponse,
      GroupsControllerCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin/groups`,
        method: "POST",
        body: queryArg.createGroupDto,
      }),
    }),
    groupsControllerFindAll: build.query<
      GroupsControllerFindAllApiResponse,
      GroupsControllerFindAllApiArg
    >({
      query: (queryArg) => ({ url: `/api/admin/groups` }),
    }),
    groupsControllerFindOne: build.query<
      GroupsControllerFindOneApiResponse,
      GroupsControllerFindOneApiArg
    >({
      query: (queryArg) => ({ url: `/api/admin/groups/${queryArg.id}` }),
    }),
    groupsControllerUpdate: build.mutation<
      GroupsControllerUpdateApiResponse,
      GroupsControllerUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin/groups/${queryArg.id}`,
        method: "PATCH",
        body: queryArg.updateGroupDto,
      }),
    }),
    groupsControllerRemove: build.mutation<
      GroupsControllerRemoveApiResponse,
      GroupsControllerRemoveApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin/groups/${queryArg.id}`,
        method: "DELETE",
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as api };
export type GroupsControllerCreateApiResponse = unknown;
export type GroupsControllerCreateApiArg = {
  createGroupDto: CreateGroupDto;
};
export type GroupsControllerFindAllApiResponse = unknown;
export type GroupsControllerFindAllApiArg = {
  take: number;
  skip: number;
};
export type GroupsControllerFindOneApiResponse = unknown;
export type GroupsControllerFindOneApiArg = {
  id: Group;
};
export type GroupsControllerUpdateApiResponse = unknown;
export type GroupsControllerUpdateApiArg = {
  id: Group;
  updateGroupDto: UpdateGroupDto;
};
export type GroupsControllerRemoveApiResponse = unknown;
export type GroupsControllerRemoveApiArg = {
  id: Group;
};
export type CreateGroupDto = {
  name: string;
  roles: string[];
};
export type Group = {};
export type UpdateGroupDto = {
  name: string;
  roles: string[];
};
export const {
  useGroupsControllerCreateMutation,
  useGroupsControllerFindAllQuery,
  useGroupsControllerFindOneQuery,
  useGroupsControllerUpdateMutation,
  useGroupsControllerRemoveMutation,
} = injectedRtkApi;
