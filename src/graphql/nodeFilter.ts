import { createFilter, optionsSchemas } from "@/utils/filter";

// prettier-ignore
export const nodes = createFilter({
  id: ["text", optionsSchemas.schema2],
  createdAt: ["text", optionsSchemas.schema5],
  createdById: ["text", optionsSchemas.schema2],
  updatedAt: ['text', optionsSchemas.schema5],
  updatedById: ["text", optionsSchemas.schema2],
  deletedAt: ['text', optionsSchemas.schema6_all],
  deletedById: ['text', optionsSchemas.schema2],
  gridVersion: [],
  nodeId: [],
  farmId: [],
  twinId: [],
  location: ["text", optionsSchemas.schema2],
  countryId: [],
  cityId: [],
  hru: ['text'],
  sru: ['text'],
  cru: ['text'],
  mru: ['text'],
  publicConfig: ['text', optionsSchemas.schema2],
  uptime: [],
  created: [],
  farmingPolicyId: [],
});
