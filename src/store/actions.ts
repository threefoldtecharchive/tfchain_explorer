import type { ActionContext } from "vuex";
import type { IState } from "./state";
import apollo from "@/plugins/apollo";
import { getDataQuery, GetDataQueryType, getTotalCountQuery, GetTotalCountQueryType } from '../graphql/api';
import { MutationTypes } from './mutations';


export enum ActionTypes {
    LOAD_DATA = 'loadData'
}

export default {
    loadData({ commit }: ActionContext<IState, IState>) {
        commit(MutationTypes.SET_LOAD, true);
    
        apollo.defaultClient.query<GetTotalCountQueryType>({
            query: getTotalCountQuery
        })
        .then(({ data }) => {
            const { nodes, farms, twins, countries, nodeContracts } = data;
            return {
                nodes: nodes.totalCount,
                farms: farms.totalCount,
                twins: twins.totalCount,
                countries: countries.totalCount,
                nodeContracts: nodeContracts.totalCount
            };
        })
        .then((variables) => {
            return apollo.defaultClient.query<GetDataQueryType>({
                query: getDataQuery,
                variables
            })
        })
        .then(({ data }) => {
            commit(MutationTypes.SET_DATA, data);
        })
        .catch((err) => {
            /**
             * @todo Should handle this error nicely. :"(
             */
            console.log('something went wrong', err);
        })
        .finally(() => {
            commit(MutationTypes.SET_LOAD, false);
        })
    }
}