import gql from "graphql-tag";

export class NodeModel {
  constructor(
    // public location,
    // public publicConfig,
    public id: string,
    public createdAt: string,
    public createdById: string,
    public updatedAt: string | null,
    public updatedById: string | null,
    public deletedAt: string | null,
    public deletedById: string | null,
    public version: number,
    public gridVersion: number,
    public nodeId: number,
    public farmId: number,
    public twinId: number,
    public locationId: string,
    public countryId: number | null,
    public cityId: number | null,
    public hru: string | null,
    public sru: string | null,
    public cru: string | null,
    public mru: string | null,
    public publicConfigId: string | null
  ) {}
}

const nodeBaseFragment = gql`
  fragment NodeBase on Node {
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
    countryId
    cityId
    hru
    sru
    cru
    mru
    publicConfigId
  }
`;

export const nodesQuery = gql`
  ${nodeBaseFragment}
  query nodes($where: NodeWhereInput) {
    nodes(where: $where) {
      ...NodeBase
    }
  }
`;
