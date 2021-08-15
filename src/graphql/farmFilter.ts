import { createFilter, optionsSchemas } from "@/utils/filter";

export const farms = createFilter({
  id: ["text", optionsSchemas.schema2],
  createdAt: ["text", optionsSchemas.schema5],
  createdById: ["text", optionsSchemas.schema2],
  updatedAt: ["text", optionsSchemas.schema5],
  updatedById: ["text", optionsSchemas.schema2],
  deletedAt: ["text", optionsSchemas.schema6_all],
  deletedById: ["text", optionsSchemas.schema2],
  gridVersion: [],
  nodeId: [],
  farmId: [],
  name: ["text", ["eq", "contains", "endsWith", "endsWith", "in"]],
  twinId: [],
  pricingPolicyId: [],
  countryId: [],
  cityId: [],
});
