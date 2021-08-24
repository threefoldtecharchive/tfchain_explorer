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
  publicConfigId?: string;
  uptime?: number;
  created: number;
  farmingPolicyId: number;
  // locationId: string;
  // countryId?: number;

  location: Location;
  country?: string;
  city?: string;
}

export const NodeType = gql`
  ${LocationType}

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
    publicConfigId
    uptime
    created
    farmingPolicyId
    # countryId
    # cityId

    location {
      ...LocationType
    }
    country
    city
  }
`;

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
  // countryId?: number;
  // cityId?: number;

  location: Location;
  country?: string;
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
    # countryId
    # cityId
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

// export interface ICountry {
//   id: string;
//   createdAt: string;
//   createdById: string;
//   updatedAt?: string;
//   updatedById?: string;
//   deletedAt?: string;
//   deletedById?: string;
//   version: number;
//   code: string;
//   name: string;
//   region: string;
//   subregion: string;
// }

// export const CountryType = gql`
//   fragment CountryType on Country {
//     id
//     createdAt
//     createdById
//     updatedAt
//     updatedById
//     deletedAt
//     deletedById
//     version
//     code
//     name
//     region
//     subregion
//   }
// `;

export interface IPublicConfig {
  id: string;
  createdAt: string;
  createdById: string;
  updatedAt?: string;
  updatedById?: string;
  deletedAt?: string;
  deletedById?: string;
  version: number;
  ipv4: string;
  ipv6: string;
  gw4: string;
  gw6: string;
}

export const PublicConfigType = gql`
  fragment PublicConfigType on PublicConfig {
    id
    createdAt
    createdById
    updatedAt
    updatedById
    deletedAt
    deletedById
    version
    ipv4
    ipv6
    gw4
    gw6
  }
`;

// export interface ICity {
//   id: string;
//   createdAt: string;
//   createdById: string;
//   updatedAt?: string;
//   updatedById?: string;
//   deletedAt?: string;
//   deletedById?: string;
//   version: number;
//   countryId: number;
//   name: string;
// }

// export const CityType = gql`
//   fragment CityType on City {
//     id
//     createdAt
//     createdById
//     updatedAt
//     updatedById
//     deletedAt
//     deletedById
//     version
//     countryId
//     name
//   }
// `;

export interface GetDataQueryType {
  nodes: INode[];
  farms: IFarm[];
  locations: ILocation[];
  twins: ITwin[];
  // countries: ICountry[];
  publicConfigs: IPublicConfig[];
  // cities: ICity[];
}

// ${CityType}
// ${CountryType}
export const getDataQuery = gql`
  ${NodeType}
  ${FarmType}
  ${TwinType}
  ${PublicConfigType}

  query getDataQuery {
    nodes {
      ...NodeType
    }
    farms {
      ...FarmType
    }
    # locations {
    #   ...LocationType
    # }
    twins {
      ...TwinType
    }
    # countries {
    #   ...CountryType
    # }
    publicConfigs {
      ...PublicConfigType
    }
    # cities {
    #   ...CityType
    # }
  }
`;
