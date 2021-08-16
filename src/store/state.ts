import { GetDataQueryType } from "@/graphql/api";

export interface IState {
  data: GetDataQueryType | null;
  loading: boolean;
  filters: {
    nodes: {
      ids: string[];
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
      ids: [],
    },
    farms: {
      ids: [],
    },
  },
} as IState;
