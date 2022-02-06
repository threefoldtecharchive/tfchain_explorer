/**
 * @description
 * This file include every single interface in graphql api
 * also has the full interface of each type their
 */

import { gql } from "graphql-tag";

export interface ILocation {
  id: string;
  createdAt: string;
  createdById: string;
  updatedAt?: string;
  updatedById?: string;
  deletedAt?: string;
  deletedById?: string;
  version: number;
  longitude: string;
  latitude: string;
}

export const LocationType = gql`
  fragment LocationType on Location {
    id
    createdAt
    createdById
    updatedAt
    updatedById
    deletedAt
    deletedById
    version
    longitude
    latitude
  }
`;
export interface ICountry {
  id: string;
  name: string;
  code: string;
  lat: string;
  long: string;
  region: string;
  countryId: number;
  createdAt: string;
  createdById: string;
  deletedAt: string;
  deletedById: string;
  subregion: string;
  updatedById: string;
  updatedAt: string;
  version: number;
}

export const CountryType = gql`
  fragment CountryType on Country {
    id
    name
    code
    lat
    long
    region
    countryId
    createdAt
    createdById
    deletedAt
    deletedById
    subregion
    updatedById
    updatedAt
    version
  }
`;

export interface Interfaces {
  name: string;
  mac: string;
  ips: string;
  id: string;
}
export interface INode {
  id: string;
  createdAt: string;
  createdById: string;
  updatedAt?: string;
  updatedById?: string;
  deletedAt?: string;
  deletedById?: string;
  version: number;
  gridVersion: number;
  nodeId: number;
  farmId: number;
  twinId: number;
  cityId?: number;
  hru?: string;
  sru?: string;
  cru?: string;
  mru?: string;
  publicConfig?: IPublicConfig;
  uptime?: number;
  created: number;
  farmingPolicyId: number;
  location: Location;
  country?: string;
  city?: string;
  interfaces: Interfaces[];
  status: boolean;
  certificationType: "Diy" | "Certified";
}

export const PublicConfigType = gql`
  fragment PublicConfigType on PublicConfig {
    domain
    ipv4
    ipv6
    gw4
    gw6
  }
`;

export const NodeType = gql`
  ${LocationType}
  ${PublicConfigType}

  fragment NodeType on Node {
    id
    createdAt
    createdById
    updatedAt
    updatedById
    deletedAt
    deletedById
    version
    gridVersion
    nodeId
    farmId
    twinId
    locationId
    hru
    sru
    cru
    mru
    publicConfig {
      ...PublicConfigType
    }
    uptime
    created
    farmingPolicyId
    location {
      ...LocationType
    }
    country
    city
    interfaces {
      ips
      mac
      name
      id
    }
    certificationType
  }
`;
export interface IPublicIPs {
  id: string;
  gateway: string;
  farmId: string;
  contractId: number;
  ip: string;
}

interface IPublicIpStatus {
  total: number;
  used: number;
  free: number;
}

export interface IFarm {
  id: string;
  createdAt: string;
  createdById: string;
  updatedAt?: string;
  updatedById?: string;
  deletedAt?: string;
  deletedById?: string;
  version: number;
  gridVersion: number;
  farmId: number;
  name: string;
  twinId: number;
  pricingPolicyId: number;
  certificationType: "Diy" | "Certified";
  publicIPs: IPublicIPs[];
  publicIpStatus?: IPublicIpStatus;
  stellarAddress?: string;
}

export const FarmType = gql`
  fragment FarmType on Farm {
    id
    createdAt
    createdById
    updatedAt
    updatedById
    deletedAt
    deletedById
    version
    gridVersion
    farmId
    name
    twinId
    pricingPolicyId
    certificationType
    publicIPs {
      id
      gateway
      farmId
      contractId
      ip
    }
  }
`;

export interface INodeContract {
  id: string;
  nodeId: number;
  contractId: number;
  deploymentHash: string;
  state: string;
  twinId: number;
}

export const NodeContractType = gql`
  fragment NodeContractType on NodeContract {
    id
    nodeId
    contractId
    deploymentHash
    state
    twinId
  }
`;

export interface ITwin {
  id: string;
  createdAt: string;
  createdById: string;
  updatedAt?: string;
  updatedById?: string;
  deletedAt?: string;
  deletedById?: string;
  version: number;
  gridVersion: number;
  twinId: number;
  accountId: string;
  ip: string;
}

export const TwinType = gql`
  fragment TwinType on Twin {
    id
    createdAt
    createdById
    updatedAt
    updatedById
    deletedAt
    deletedById
    version
    gridVersion
    twinId
    accountId
    ip
  }
`;

export interface IPublicConfig {
  ipv4: string;
  ipv6: string;
  gw4: string;
  gw6: string;
  domain: string;
}

type TotalCountType = { totalCount: number };
export interface GetTotalCountQueryType<T = TotalCountType> {
  nodes: T;
  farms: T;
  twins?: T;
  nodeContracts?: T;
}

export const getTotalCountQuery = gql`
  query getTotalCountQuery {
    nodes: nodesConnection {
      totalCount
    }
    farms: farmsConnection {
      totalCount
    }
    twins: twinsConnection {
      totalCount
    }
    nodeContracts: nodeContractsConnection {
      totalCount
    }
  }
`;
export interface GetDataQueryType {
  nodes: INode[];
  farms: IFarm[];
  locations: ILocation[];
  publicConfigs: IPublicConfig[];
}

export const getDataQuery = gql`
  ${NodeType}
  ${FarmType}

  query getDataQuery($limit: Int!, $offset: Int!) {
    nodes(limit: $limit, offset: $offset) {
      ...NodeType
    }
    farms(limit: $limit, offset: $offset) {
      ...FarmType
    }
  }
`;

/* Refactored Code */

export interface IFetchPaginatedData<T> {
  total: { count: number };
  items: T[];
}

export const getFarmsQuery = gql`
  query getFarms(
    $limit: Int!
    $offset: Int!
    $farmId_in: [Int!]
    $name_in: [String!]
    $twinId_in: [Int!]
    $certificationType_in: [CertificationType!]
    $pricingPolicyId_in: [Int!]
  ) {
    total: farmsConnection(
      where: {
        farmId_in: $farmId_in
        name_in: $name_in
        twinId_in: $twinId_in
        certificationType_in: $certificationType_in
        pricingPolicyId_in: $pricingPolicyId_in
      }
    ) {
      count: totalCount
    }

    items: farms(
      limit: $limit
      offset: $offset
      where: {
        farmId_in: $farmId_in
        name_in: $name_in
        twinId_in: $twinId_in
        certificationType_in: $certificationType_in
        pricingPolicyId_in: $pricingPolicyId_in
      }
    ) {
      id: farmId
      name
      publicIPs {
        contractId
      }
      twinId
      certificationType
      pricingPolicyId
    }
  }
`;

export interface IFilterQuery {
  items: Array<{ value: string }>;
}

export const filterQuery = (prop: string) => {
  const query = `
    query queryFilter($sub_string: String) {
      items: farms(where: { ${prop}_contains: $sub_string}) {
        value: ${prop}
      }
    }
  `;
  return gql(query);
};
