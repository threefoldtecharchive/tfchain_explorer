import { ApiPromise, WsProvider } from "@polkadot/api";
import { types } from "../json/types";
const URL = window.configs.polkadot_url;

function _toString(bytes: ArrayLike<number>): string {
  return Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
}

export default function getPricingPolicies(): Promise<Map<number, string>> {
  const provider = new WsProvider(URL);

  return ApiPromise.create({ provider, types })
    .then((api) => {
      return api.query.tfgridModule.pricingPolicies.entries();
    })
    .then(([[_, ...entries]]) => {
      return entries.reduce((map, { id: { words: [id] }, name }: any) => {
        return map.set(id, _toString(name));
      }, new Map<number, string>());
    });
}
