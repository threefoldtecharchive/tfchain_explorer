import { GetDataQueryType } from "@/graphql/api";

export interface IState {
  data: GetDataQueryType | null;
  loading: boolean;
  filters: {
    nodes: {
      nodeId: string[];
      createdById: string[];
      farmId: string[];
      twinId: string[];
      locationId: string[];
      farmingPolicyId: string[];
      hru: {
        min: number;
        max: number;
      };
      cru: {
        min: number;
        max: number;
      };
      mru: {
        min: number;
        max: number;
      };
      sru: {
        min: number;
        max: number;
      };
    };
    farms: {
      ids: string[];
    };
  };
}

export default {
  data: null,
  loading: false,
  node_filters: {
    ids: [],
  },
  filters: {
    nodes: {
      nodeId: [],
      createdById: [],
      farmId: [],
      twinId: [],
      locationId: [],
      farmingPolicyId: [],
      hru: {
        min: 0,
        max: Number.MAX_SAFE_INTEGER,
      },
      cru: {
        min: 0,
        max: Number.MAX_SAFE_INTEGER,
      },
      sru: {
        min: 0,
        max: Number.MAX_SAFE_INTEGER,
      },
      mru: {
        min: 0,
        max: Number.MAX_SAFE_INTEGER,
      },
    },
    farms: {
      ids: [],
    },
  },
} as IState;
