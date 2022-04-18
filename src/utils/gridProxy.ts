import { NodeQuries } from "../types/gridProxy";

interface Resp<T> {
  data: T;
  headers: Response["headers"];
}

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

  create<T>(): Promise<Resp<T>> {
    const quries = Object.entries(this._quries)
      .map((q) => q.join("="))
      .join("&");

    let headers: Response["headers"];
    return fetch(`${this._url}?${quries}`)
      .then((res) => {
        headers = res.headers;
        return res.json();
      })
      .then((data) => {
        return { data, headers };
      });
  }
}

export class GridProxy {
  private static request<T>(url: string, quries: any): Promise<Resp<T>> {
    const req = new GridProxyRequest(url);
    for (const query in quries) {
      req.set(query, quries[query]);
    }
    return req.create();
  }

  static nodes<T>(queries: NodeQuries = {}) {
    return GridProxy.request<T>("/nodes", queries);
  }
}
