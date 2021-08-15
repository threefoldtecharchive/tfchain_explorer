// All filter available options
type FilterOptions = "eq" | "lt" | "lte" | "gt" | "gte" | "in" | "all";
const optionsSchemas = {
  schema2: ["eq", "in"] as FilterOptions[],
  schema5: ["eq", "lt", "lte", "gt", "gte"] as FilterOptions[],
  schema6_in: ["eq", "lt", "lte", "gt", "gte", "in"] as FilterOptions[],
  schema6_all: ["eq", "lt", "lte", "gt", "gte", "all"] as FilterOptions[],
};

export const inMath: any = {
  eq: "=",
  lt: "<",
  lte: "<=",
  gt: ">",
  gte: ">=",
  in: "value1 value2 value3",
  all: "false or true",
};

export const inMeaningful: any = {
  eq: "equals",
  lt: "less than",
  lte: "less than equals",
  gt: "greater than",
  gte: "greater than equals",
  in: "in list",
  all: "all of them",
};

export interface FilterOptionModel {
  model: "option";
  type: "text" | "number";
  enabled: boolean;
  value: any;
  name: string;
}

function createFilterOption(
  name: string,
  type: "number" | "text",
  schema: FilterOptions[]
) {
  const res: { [key: string]: FilterOptionModel } = {};

  for (const filter of schema) {
    const value =
      filter === "in"
        ? ""
        : filter === "all"
        ? false
        : type === "text"
        ? ""
        : 0;

    res[name + "_" + filter] = {
      model: "option",
      enabled: false,
      name: filter,
      type,
      value,
    };
  }

  return {
    enabled: false,
    options: res,
  };
}

export interface FilterModel {
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

function generateOptionQuery(option: FilterOptionModel) {
  const { type, value = "", name } = option;

  if (name === "all") return value;

  if (name === "in") {
    const res: string[] = value
      .toString()
      .trim()
      .split(" ");

    return type === "number"
      ? res.map((e) => +e.trim()).filter((e) => !isNaN(e))
      : res;
  }

  return value.toString().trim() === ""
    ? null
    : type === "text"
    ? value.trim()
    : isNaN(+value)
    ? null
    : +value;
}

function generateWhereQuery(filter: FilterModel) {
  const { filters } = filter;
  const res: { [key: string]: any } = {};

  for (const f in filters) {
    if (!filters[f].enabled) continue;
    const { options } = filters[f];

    for (const name in options) {
      if (!options[name].enabled) continue;

      const v = generateOptionQuery(options[name]);
      if (v !== null) {
        res[name] = v;
      }
    }
  }

  return res;
}

export { optionsSchemas, createFilter, createFilterOption, generateWhereQuery };
