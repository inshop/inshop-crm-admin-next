import { api } from "../api";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    contactsControllerCreate: build.mutation<
      ContactsControllerCreateApiResponse,
      ContactsControllerCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin/clients/${queryArg.clientId}/contacts`,
        method: "POST",
        body: queryArg.createContactDto,
      }),
    }),
    contactsControllerFindAll: build.query<
      ContactsControllerFindAllApiResponse,
      ContactsControllerFindAllApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin/clients/${queryArg.clientId}/contacts`,
      }),
    }),
    contactsControllerFindOne: build.query<
      ContactsControllerFindOneApiResponse,
      ContactsControllerFindOneApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin/clients/${queryArg.clientId}/contacts/${queryArg.id}`,
      }),
    }),
    contactsControllerUpdate: build.mutation<
      ContactsControllerUpdateApiResponse,
      ContactsControllerUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin/clients/${queryArg.clientId}/contacts/${queryArg.id}`,
        method: "PATCH",
        body: queryArg.updateContactDto,
      }),
    }),
    contactsControllerRemove: build.mutation<
      ContactsControllerRemoveApiResponse,
      ContactsControllerRemoveApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin/clients/${queryArg.clientId}/contacts/${queryArg.id}`,
        method: "DELETE",
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as api };
export type ContactsControllerCreateApiResponse = unknown;
export type ContactsControllerCreateApiArg = {
  clientId: Client;
  createContactDto: CreateContactDto;
};
export type ContactsControllerFindAllApiResponse = unknown;
export type ContactsControllerFindAllApiArg = {
  clientId: Client;
};
export type ContactsControllerFindOneApiResponse = unknown;
export type ContactsControllerFindOneApiArg = {
  clientId: Client;
  id: Contact;
};
export type ContactsControllerUpdateApiResponse = unknown;
export type ContactsControllerUpdateApiArg = {
  clientId: Client;
  id: Contact;
  updateContactDto: UpdateContactDto;
};
export type ContactsControllerRemoveApiResponse = unknown;
export type ContactsControllerRemoveApiArg = {
  clientId: Client;
  id: Contact;
};
export type Client = {};
export type CreateContactDto = {
  value: string;
  type: string;
};
export type Contact = {};
export type UpdateContactDto = {
  value: string;
  type: string;
};
export const {
  useContactsControllerCreateMutation,
  useContactsControllerFindAllQuery,
  useContactsControllerFindOneQuery,
  useContactsControllerUpdateMutation,
  useContactsControllerRemoveMutation,
} = injectedRtkApi;
