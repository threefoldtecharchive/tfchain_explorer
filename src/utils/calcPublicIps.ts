import { IFarm } from "@/graphql/api";

export function getFarmFreePublicIps(farm: IFarm): number {
  const freePublicIps = farm.publicIps.filter((x: any) => x.contractId == 0);
  return freePublicIps.length;
}

export function getFarmUsedPublicIps(farm: IFarm): number {
  const freePublicIps = farm.publicIps.filter((x: any) => x.contractId != 0);
  return freePublicIps.length;
}
