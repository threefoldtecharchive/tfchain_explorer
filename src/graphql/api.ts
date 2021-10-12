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
  publicConfig?: IPublicConfig;
  uptime?: number;
  created: number;
  farmingPolicyId: number;
  location: Location;
  country?: string;
  city?: string;
}

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
    publicConfigId
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

export interface GetDataQueryType {
  nodes: INode[];
  farms: IFarm[];
  locations: ILocation[];
  twins: ITwin[];
  publicConfigs: IPublicConfig[];
}

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
    twins {
      ...TwinType
    }
    publicConfigs {
      ...PublicConfigType
    }
  }
`;
