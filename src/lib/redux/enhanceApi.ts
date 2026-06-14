import { api } from "./api";

import "./features/auth";
import "./features/users";
import "./features/groups";
import "./features/clients";
import "./features/contacts";
import "./features/audits";

const entities = [
  "users",
  "groups",
  "clients",
  "contacts",
  "audits",
];

type EntityTag = { type: "Entity"; id: string };

function listTag(entity: string): EntityTag {
  return { type: "Entity", id: `${entity}-LIST` };
}

function entityTag(entity: string, id: number): EntityTag {
  return { type: "Entity", id: `${entity}-${id}` };
}

const endpointEnhancements: Record<string, object> = {};

for (const entity of entities) {
  endpointEnhancements[`${entity}ControllerFindAll`] = {
    providesTags: (result: [Array<{ id: number }>, number] | undefined) => {
      const tags: EntityTag[] = [listTag(entity)];
      const rows = result?.[0];
      if (rows) {
        tags.push(...rows.map((row) => entityTag(entity, row.id)));
      }
      return tags;
    },
  };

  endpointEnhancements[`${entity}ControllerFindOne`] = {
    providesTags: (_result: unknown, _error: unknown, arg: { id: number }) => [
      entityTag(entity, arg.id),
    ],
  };

  const listInvalidation = [listTag(entity)];

  endpointEnhancements[`${entity}ControllerCreate`] = {
    invalidatesTags: listInvalidation,
  };

  endpointEnhancements[`${entity}ControllerUpdate`] = {
    invalidatesTags: (
      _result: unknown,
      _error: unknown,
      arg: { id: number },
    ) => [listTag(entity), entityTag(entity, arg.id)],
  };

  endpointEnhancements[`${entity}ControllerRemove`] = {
    invalidatesTags: listInvalidation,
  };
}

api.enhanceEndpoints({
  endpoints: endpointEnhancements,
});
