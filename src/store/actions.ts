import type { ActionContext } from "vuex";
import type { IState } from "./state";
import { MutationTypes } from './mutations';
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
        fetch(`${window.configs.proxy_url}/stats`)
        .then((data) => data.json())
        .then((data) => {
            const { nodes, farms, twins, contracts, publicIps,accessNodes,
                 countries, gateways, totalCru, totalHru, totalMru,totalSru } = data;
            state.nodeContractsNo = contracts;
            state.twinsNo = twins;
            state.farmsNo = farms;
            state.nodesNo = nodes;
            state.publicIpsNo = publicIps;
            state.accessNodesNo = accessNodes;
            state.countriesNo = countries;
            state.gatewaysNo = gateways;
            state.totalCru = totalCru;
            state.totalHru = totalHru;
            state.totalMru = totalMru;
            state.totalSru = totalSru;
            
            return {
                nodes: nodes,
                farms: farms,
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