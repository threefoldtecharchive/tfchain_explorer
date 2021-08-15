import gql from "graphql-tag";

export interface FarmModel {
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
  twinId?: number;
  pricingPolicyId?: number;
  certificationType: "Diy" | "Certified";
  countryId?: number;
  cityId?: number;
}

const farmBaseFragment = gql`
  fragment FarmBase on Farm {
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
    countryId
    cityId
  }
`;

export const farmsQuery = gql`
  ${farmBaseFragment}
  query farms($where: FarmWhereInput) {
    farms(where: $where) {
      ...FarmBase
    }
  }
`;
