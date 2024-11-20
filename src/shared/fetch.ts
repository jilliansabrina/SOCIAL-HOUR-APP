export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  DELETE = "DELETE",
}

type HttpRequestPayload<E = any> = {
  method: HttpMethod;
  path: string;
  headers?: Record<string, string>;
  body?: E;
};

export async function apiCall<E, Y>(payload: HttpRequestPayload<Y>) {
  const { method, path, headers, body } = payload;
  const url = "http://localhost:3001" + path;
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return data as E;
}
