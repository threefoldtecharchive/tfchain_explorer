import { AxiosInstance } from "axios";
import { setup } from "axios-cache-adapter";
import { NodeQuries, FarmQuries } from "../types/gridProxy";

const axiosReq: AxiosInstance = setup({
  baseURL: "http://192.241.158.21:8080",
  cache: {
    debug: process.env.NODE_ENV === "development",
    maxAge: 15 * 60 * 1000,
    exclude: {
      query: false,
    },
  },
});

export class GridProxyRequest {
  private quries: { [key: string]: any } = {};

  constructor(private url: string) {}

  set(query: string, value: any) {
    this.quries[query] = value;
    return this;
  }

  create<T>() {
    const quries = Object.entries(this.quries)
      .map((q) => q.join("="))
      .join("&");

    return axiosReq.get<T>(`${this.url}?${quries}`);
  }
}

export class GridProxy {
  static readonly instance = axiosReq;

  private static request<T>(url: string, quries: any) {
    const req = new GridProxyRequest(url);
    for (const query in quries) {
      req.set(query, quries[query]);
    }
    return req.create<T>();
  }

  static nodes<T>(queries: NodeQuries = {}) {
    return GridProxy.request<T>("/nodes", queries);
  }

  static farms<T>(queries: FarmQuries = {}) {
    return GridProxy.request<T>("/farms", queries);
  }

  static farmingPolicies() {
    return GridProxy.request<any>(
      "https://raw.githubusercontent.com/threefoldtech/tfchain/development/farming_policies.json",
      {}
    );
  }
}
