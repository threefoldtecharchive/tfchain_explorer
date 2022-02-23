import type { ActionContext } from "vuex";
import type { IState } from "./state";
import apollo from "@/plugins/apollo";
import { getTotalCountQuery, GetTotalCountQueryType } from '../graphql/api';
import { MutationTypes } from './mutations';
import getPricingPolicies from "@/utils/getPricingPolicies";
import createDataRequests from "@/utils/createDataRequests";
import isNodeOnline from "@/utils/isNodeOnline";
import getChainData from "@/utils/getChainData";
export enum ActionTypes {
    INIT_POLICIES = "initPolicies",
    INIT_PRICING_POLICIES = "initPricingPolicies",
    LOAD_DATA = "loadData"
}

export default {
    initPolicies({ commit }: ActionContext<IState, IState>) {
        fetch("https://raw.githubusercontent.com/threefoldtech/tfchain/development/farming_policies.json")
            .then<{id: number, name: string}[]>(res => res.json())
            .then(items => {
                return items.map(({ name }) => name);
            })
            .then(data => {
                commit(MutationTypes.SET_POLICIES, data);
            });
    },
    loadData({ state, commit }: ActionContext<IState, IState>) {
        commit(MutationTypes.SET_LOAD, true);
            apollo.defaultClient.query<GetTotalCountQueryType>({
                query: getTotalCountQuery
            })
            .then(({ data }) => data)
        .then((data) => {
            const { nodes, farms, twins, nodeContracts } = data;
            state.nodeContractsNo = nodeContracts?.totalCount ?? 0
            state.twinsNo = twins?.totalCount ?? 0;
            
            return {
                nodes: nodes.totalCount,
                farms: farms.totalCount,
            };
        })
        .then(createDataRequests)
        .then((data) => {
            data.nodes = data.nodes.map(node => {
                node.status = isNodeOnline(node);
                return node
            })
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
    },
    loadChainData(store: ActionContext<IState, IState>): void{
        getChainData(store);
    }
}