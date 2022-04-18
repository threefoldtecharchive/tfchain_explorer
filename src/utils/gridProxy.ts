import { NodeQuries } from "../types/gridProxy";

export class GridProxyRequest {
  private _url = "http://192.241.158.21:8080";
  private _quries: { [key: string]: any } = {};

  constructor(url: string) {
    if (url) this._url += url;
  }

  set(query: string, value: any) {
    this._quries[query] = value;
    return this;
  }

  create<T>(): Promise<T> {
    const quries = Object.entries(this._quries)
      .map((q) => q.join("="))
      .join("&");

    return fetch(`${this._url}?${quries}`).then<T>((res) => {
      return res.json();
    });
  }
}

export class GridProxy {
  private static request<T>(url: string, quries: any): Promise<T> {
    const req = new GridProxyRequest(url);
    for (const query in quries) {
      req.set(query, quries[query]);
    }
    return req.create();
  }

  static nodes<T>(queries: NodeQuries = {}): Promise<T> {
    return GridProxy.request("/nodes", queries);
  }
}
