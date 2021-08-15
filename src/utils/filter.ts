// All filter available options
type FilterOptions = "eq" | "lt" | "lte" | "gt" | "gte" | "in";
const optionsSchemas = {
  schema2: ["eq", "in"] as FilterOptions[],
  schema5: ["eq", "lt", "lte", "gt", "gte"] as FilterOptions[],
  schema6_in: ["eq", "lt", "lte", "gt", "gte", "in"] as FilterOptions[],
  schema6_all: ["eq", "lt", "lte", "gt", "gte", "all"] as FilterOptions[],
};

interface FilterOptionModel {
  model: "option";
  type: "text" | "number";
  enabled: boolean;
  value: number | string | undefined;
  name: string;
}

function createFilterOption(
  name: string,
  type: "number" | "text",
  schema: FilterOptions[]
) {
  const res: { [key: string]: FilterOptionModel } = {};

  for (const filter of schema) {
    res[name + "_" + filter] = {
      model: "option",
      enabled: false,
      name: filter,
      type,
      value: undefined,
    };
  }

  return res;
}

interface FilterModel {
  model: "filter";
  filters: {
    [key: string]: ReturnType<typeof createFilterOption>;
  };
}

interface CreateFilterInput {
  [key: string]:
    | []
    | ["text" | "number"]
    | ["text" | "number", FilterOptions[]];
}

function createFilter(filters: CreateFilterInput): FilterModel {
  const res: FilterModel["filters"] = {};

  for (const key in filters) {
    const [type = "number", schema = optionsSchemas.schema6_in] = filters[key];
    res[key] = createFilterOption(key, type, schema);
  }

  return {
    model: "filter",
    filters: res,
  };
}

export { optionsSchemas, createFilter, createFilterOption };
