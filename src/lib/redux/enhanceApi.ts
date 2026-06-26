import { api } from "./api";

import "./features/auth";
import "./features/users";
import "./features/groups";
import "./features/projects";
import "./features/environments";
import "./features/featureFlags";
import "./features/audits";
import "./features/apiTokens";

const entities = [
  "users",
  "groups",
  "projects",
  "environments",
  "featureFlags",
  "audits",
  "apiTokens",
];

type EntityTag = { type: "Entity"; id: string };

function listTag(entity: string): EntityTag {
  return { type: "Entity", id: `${entity}-LIST` };
}

function entityTag(entity: string, id: number): EntityTag {
  return { type: "Entity", id: `${entity}-${id}` };
}

function withAuditInvalidation(tags: EntityTag[], entity: string): EntityTag[] {
  if (entity === "audits") return tags;
  return [...tags, listTag("audits")];
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

  const listInvalidation = withAuditInvalidation([listTag(entity)], entity);

  endpointEnhancements[`${entity}ControllerCreate`] = {
    invalidatesTags: listInvalidation,
  };

  endpointEnhancements[`${entity}ControllerUpdate`] = {
    invalidatesTags: (
      _result: unknown,
      _error: unknown,
      arg: { id: number },
    ) =>
      withAuditInvalidation(
        [listTag(entity), entityTag(entity, arg.id)],
        entity,
      ),
  };

  endpointEnhancements[`${entity}ControllerRemove`] = {
    invalidatesTags: listInvalidation,
  };
}

api.enhanceEndpoints({
  endpoints: {
    ...endpointEnhancements,
    featureFlagsControllerUpdateEnvironmentValue: {
      invalidatesTags: (
        _result: unknown,
        _error: unknown,
        arg: { id: number },
      ) => [
        { type: "Entity" as const, id: "featureFlags-LIST" },
        { type: "Entity" as const, id: `featureFlags-${arg.id}` },
        { type: "Entity" as const, id: "audits-LIST" },
      ],
    },
  },
});
