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

type HttpResponse<E> = {
  status: number;
  data: E;
};

export async function apiCall<E = any, Y = any>(
  payload: HttpRequestPayload<Y>
) {
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
  const result: HttpResponse<E> = {
    status: response.status,
    data: data as E,
  };
  if (response.status >= 202) {
    console.error(response);
    throw new Error("Failed to fetch data");
  }
  return result;
}
