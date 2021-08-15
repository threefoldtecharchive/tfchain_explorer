import { createFilter, optionsSchemas } from "@/utils/filter";

// prettier-ignore
export const nodes = createFilter({
  id: ["text", optionsSchemas.schema2],
  createdAt: ["text", optionsSchemas.schema5],
  createdById: ["text", optionsSchemas.schema2],
  updatedAt: [],
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

console.log(nodes);

class OutputGenerator {
  generate(): { [key: string]: any } {
    const keys = Object.keys(this);
    return keys.reduce((res, k) => {
      const item = (this as any)[k];
      if (item && item != "") {
        res[k] = item;
      }
      return res;
    }, {} as any);
  }

  set(key: any, value: any): void {
    (this as any)[key] = value;
  }
}

class NodeWhereInputID extends OutputGenerator {
  constructor(public id_eq?: string, public id_in?: string[]) {
    super();
  }
}

class NodeWhereInputCreatedAt extends OutputGenerator {
  constructor(
    public createdAt_eq?: string,
    public createdAt_lt?: string,
    public createdAt_lte?: string,
    public createdAt_gt?: string,
    public createdAt_gte?: string
  ) {
    super();
  }
}

class NodeWhereInputCreatedBy extends OutputGenerator {
  constructor(
    public createdById_eq?: string,
    public createdById_in?: string[]
  ) {
    super();
  }
}

class NodeWhereInputUpdateAt extends OutputGenerator {
  constructor(
    public updatedAt_eq?: string,
    public updatedAt_lt?: string,
    public updatedAt_lte?: string,
    public updatedAt_gt?: string,
    public updatedAt_gte?: string
  ) {
    super();
  }
}

class NodeWhereInputUpdatedBy extends OutputGenerator {
  constructor(
    public updatedById_eq?: string,
    public updatedById_in?: string[]
  ) {
    super();
  }
}

class NodeWhereInputDeletedAt extends OutputGenerator {
  constructor(
    public deletedAt_all?: boolean,
    public deletedAt_eq?: string,
    public deletedAt_lt?: string,
    public deletedAt_lte?: string,
    public deletedAt_gt?: string,
    public deletedAt_gte?: string
  ) {
    super();
  }
}

class NodeWhereInputDeletedBy extends OutputGenerator {
  constructor(
    public deletedById_eq?: string,
    public deletedById_in?: string[]
  ) {
    super();
  }
}

class NodeWhereInputGridVersion extends OutputGenerator {
  constructor(
    public gridVersion_eq?: number,
    public gridVersion_gt?: number,
    public gridVersion_gte?: number,
    public gridVersion_lt?: number,
    public gridVersion_lte?: number,
    public gridVersion_in?: number[]
  ) {
    super();
  }
}

class NodeWhereInputNodeId extends OutputGenerator {
  constructor(
    public nodeId_eq?: number,
    public nodeId_gt?: number,
    public nodeId_gte?: number,
    public nodeId_lt?: number,
    public nodeId_lte?: number,
    public nodeId_in?: number[]
  ) {
    super();
  }
}

class NodeWhereInputFarmId extends OutputGenerator {
  constructor(
    public farmId_eq?: number,
    public farmId_gt?: number,
    public farmId_gte?: number,
    public farmId_lt?: number,
    public farmId_lte?: number,
    public farmId_in?: number[]
  ) {
    super();
  }
}

class NodeWhereInputTwinId extends OutputGenerator {
  constructor(
    public twinId_eq?: number,
    public twinId_gt?: number,
    public twinId_gte?: number,
    public twinId_lt?: number,
    public twinId_lte?: number,
    public twinId_in?: number[]
  ) {
    super();
  }
}

class NodeWhereInputLocation extends OutputGenerator {
  constructor(public location_eq?: number, public location_in?: number[]) {
    super();
  }
}

class NodeWhereInputCountryId extends OutputGenerator {
  constructor(
    public countryId_eq?: number,
    public countryId_gt?: number,
    public countryId_gte?: number,
    public countryId_lt?: number,
    public countryId_lte?: number,
    public countryId_in?: number[]
  ) {
    super();
  }
}

class NodeWhereInputCityId extends OutputGenerator {
  constructor(
    public cityId_eq?: number,
    public cityId_gt?: number,
    public cityId_gte?: number,
    public cityId_lt?: number,
    public cityId_lte?: number,
    public cityId_in?: number[]
  ) {
    super();
  }
}

class NodeWhereInputHru extends OutputGenerator {
  constructor(
    public hru_eq?: number,
    public hru_gt?: number,
    public hru_gte?: number,
    public hru_lt?: number,
    public hru_lte?: number,
    public hru_in?: number[]
  ) {
    super();
  }
}

class NodeWhereInputSru extends OutputGenerator {
  constructor(
    public sru_eq?: number,
    public sru_gt?: number,
    public sru_gte?: number,
    public sru_lt?: number,
    public sru_lte?: number,
    public sru_in?: number[]
  ) {
    super();
  }
}

class NodeWhereInputCru extends OutputGenerator {
  constructor(
    public cru_eq?: number,
    public cru_gt?: number,
    public cru_gte?: number,
    public cru_lt?: number,
    public cru_lte?: number,
    public cru_in?: number[]
  ) {
    super();
  }
}

class NodeWhereInputMru extends OutputGenerator {
  constructor(
    public mru_eq?: number,
    public mru_gt?: number,
    public mru_gte?: number,
    public mru_lt?: number,
    public mru_lte?: number,
    public mru_in?: number[]
  ) {
    super();
  }
}

class NodeWhereInputPublicConfig extends OutputGenerator {
  constructor(
    public publicConfig_eq?: string,
    public publicConfig_in?: string[]
  ) {
    super();
  }
}

interface NodeWhereInput
  extends NodeWhereInputID,
    NodeWhereInputCreatedAt,
    NodeWhereInputCreatedBy,
    NodeWhereInputUpdateAt,
    NodeWhereInputUpdatedBy,
    NodeWhereInputDeletedAt,
    NodeWhereInputDeletedBy,
    NodeWhereInputGridVersion,
    NodeWhereInputNodeId,
    NodeWhereInputFarmId,
    NodeWhereInputTwinId,
    NodeWhereInputLocation,
    NodeWhereInputCountryId,
    NodeWhereInputCityId,
    NodeWhereInputHru,
    NodeWhereInputSru,
    NodeWhereInputCru,
    NodeWhereInputMru,
    NodeWhereInputPublicConfig {
  // AND: NodeWhereInput[];
  // OR: NodeWhereInput[];
}

export class NodeFilterModel {
  constructor(
    public id = new NodeWhereInputID(),
    public createdAt = new NodeWhereInputCreatedAt(),
    public createdById = new NodeWhereInputCreatedBy(),
    public updateAt = new NodeWhereInputUpdateAt(),
    public updatedById = new NodeWhereInputUpdatedBy(),
    public deletedAt = new NodeWhereInputDeletedAt(),
    public deletedById = new NodeWhereInputDeletedBy(),
    public gridVersion = new NodeWhereInputGridVersion(),
    public nodeId = new NodeWhereInputNodeId(),
    public farmId = new NodeWhereInputFarmId(),
    public twinId = new NodeWhereInputTwinId(),
    public location = new NodeWhereInputLocation(),
    public countryId = new NodeWhereInputCountryId(),
    public cityId = new NodeWhereInputCityId(),
    public hru = new NodeWhereInputHru(),
    public sru = new NodeWhereInputSru(),
    public cru = new NodeWhereInputCru(),
    public mru = new NodeWhereInputMru(),
    public publicConfig = new NodeWhereInputPublicConfig()
  ) {}

  generate(): NodeWhereInput {
    return (Object.keys(this).reduce((res, item) => {
      const child: OutputGenerator = (this as any)[item];
      return { ...res, ...child.generate() };
    }, {}) as unknown) as NodeWhereInput;
  }
}

//   constructor(
//     public id_eq: string,
//     public id_in: string[],
//     public createdAt_eq: string,
//     public createdAt_lt: string,
//     public createdAt_lte: string,
//     public createdAt_gt: string,
//     public createdAt_gte: string,
//     public createdById_eq: string,
//     public createdById_in: string[],
//     public updatedAt_eq: string,
//     public updatedAt_lt: string,
//     public updatedAt_lte: string,
//     public updatedAt_gt: string,
//     public updatedAt_gte: string,
//     public updatedById_eq: string,
//     public updatedById_in: string[],
//     public deletedAt_all: boolean,
//     public deletedAt_eq: string,
//     public deletedAt_lt: string,
//     public deletedAt_lte: string,
//     public deletedAt_gt: string,
//     public deletedAt_gte: string,
//     public deletedById_eq: string,
//     public deletedById_in: string[],
//     public gridVersion_eq: number,
//     public gridVersion_gt: number,
//     public gridVersion_gte: number,
//     public gridVersion_lt: number,
//     public gridVersion_lte: number,
//     public gridVersion_in: number[],
//     public nodeId_eq: number,
//     public nodeId_gt: number,
//     public nodeId_gte: number,
//     public nodeId_lt: number,
//     public nodeId_lte: number,
//     public nodeId_in: number[],
//     public farmId_eq: number,
//     public farmId_gt: number,
//     public farmId_gte: number,
//     public farmId_lt: number,
//     public farmId_lte: number,
//     public farmId_in: number[],
//     public twinId_eq: number,
//     public twinId_gt: number,
//     public twinId_gte: number,
//     public twinId_lt: number,
//     public twinId_lte: number,
//     public twinId_in: number[],
//     public location_eq: number,
//     public location_in: number[],
//     public countryId_eq: number,
//     public countryId_gt: number,
//     public countryId_gte: number,
//     public countryId_lt: number,
//     public countryId_lte: number,
//     public countryId_in: number[],
//     public cityId_eq: number,
//     public cityId_gt: number,
//     public cityId_gte: number,
//     public cityId_lt: number,
//     public cityId_lte: number,
//     public cityId_in: number[],
//     public hru_eq: number,
//     public hru_gt: number,
//     public hru_gte: number,
//     public hru_lt: number,
//     public hru_lte: number,
//     public hru_in: number[],
//     public sru_eq: number,
//     public sru_gt: number,
//     public sru_gte: number,
//     public sru_lt: number,
//     public sru_lte: number,
//     public sru_in: number[],
//     public cru_eq: number,
//     public cru_gt: number,
//     public cru_gte: number,
//     public cru_lt: number,
//     public cru_lte: number,
//     public cru_in: number[],
//     public mru_eq: number,
//     public mru_gt: number,
//     public mru_gte: number,
//     public mru_lt: number,
//     public mru_lte: number,
//     public mru_in: number[],
//     public publicConfig_eq: string,
//     public publicConfig_in: string[],
//     public location: NodeWhereInput,
//     public publicConfig: NodeWhereInput,
//     public AND: NodeWhereInput[],
//     public OR: NodeWhereInput[]
//   ) {}

// interface NodeWhereInput {
//   location: LocationWhereInput;
//   publicConfig: PublicConfigWhereInput;
// }

// interface LocationWhereInput {
//   id_eq: string;
//   id_in: string[];
//   createdAt_eq: string;
//   createdAt_lt: string;
//   createdAt_lte: string;
//   createdAt_gt: string;
//   createdAt_gte: string;
//   createdById_eq: string;
//   createdById_in: string[];
//   updatedAt_eq: string;
//   updatedAt_lt: string;
//   updatedAt_lte: string;
//   updatedAt_gt: string;
//   updatedAt_gte: string;
//   updatedById_eq: string;
//   updatedById_in: string[];
//   deletedAt_all: string;
//   deletedAt_eq: string;
//   deletedAt_lt: string;
//   deletedAt_lte: string;
//   deletedAt_gt: string;
//   deletedAt_gte: string;
//   deletedById_eq: string;
//   deletedById_in: string[];
//   longitude_eq: string;
//   longitude_contains: string;
//   longitude_startsWith: string;
//   longitude_endsWith: string;
//   longitude_in: string[];
//   latitude_eq: string;
//   latitude_contains: string;
//   latitude_startsWith: string;
//   latitude_endsWith: string;
//   latitude_in: string[];
//   nodelocation_none: NodeWhereInput;
//   nodelocation_some: NodeWhereInput;
//   nodelocation_every: NodeWhereInput;
//   AND: NodeWhereInput[];
//   OR: NodeWhereInput[];
// }

// interface PublicConfigWhereInput {
//   id_eq: string;
//   id_in: string[];
//   createdAt_eq: string;
//   createdAt_lt: string;
//   createdAt_lte: string;
//   createdAt_gt: string;
//   createdAt_gte: string;
//   createdById_eq: string;
//   createdById_in: string[];
//   updatedAt_eq: string;
//   updatedAt_lt: string;
//   updatedAt_lte: string;
//   updatedAt_gt: string;
//   updatedAt_gte: string;
//   updatedById_eq: string;
//   updatedById_in: string[];
//   deletedAt_all: string;
//   deletedAt_eq: string;
//   deletedAt_lt: string;
//   deletedAt_lte: string;
//   deletedAt_gt: string;
//   deletedAt_gte: string;
//   deletedById_eq: string;
//   deletedById_in: string;
//   ipv4_eq: string;
//   ipv4_contains: string;
//   ipv4_startsWith: string;
//   ipv4_endsWith: string;
//   ipv4_in: string[];
//   ipv6_eq: string;
//   ipv6_contains: string;
//   ipv6_startsWith: string;
//   ipv6_endsWith: string;
//   ipv6_in: string[];
//   gw4_eq: string;
//   gw4_contains: string;
//   gw4_startsWith: string;
//   gw4_endsWith: string;
//   gw4_in: string[];
//   gw6_eq: string;
//   gw6_contains: string;
//   gw6_startsWith: string;
//   gw6_endsWith: string;
//   gw6_in: string[];
//   nodepublicConfig_none: NodeWhereInput;
//   nodepublicConfig_some: NodeWhereInput;
//   nodepublicConfig_every: NodeWhereInput;
//   AND: PublicConfigWhereInput[];
//   OR: PublicConfigWhereInput[];
// }
