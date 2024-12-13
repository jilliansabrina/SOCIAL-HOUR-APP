export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  DELETE = "DELETE",
  PATCH = "PATCH",
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
  const { method, path, headers = {}, body } = payload; // Default headers to an empty object
  const url = "http://localhost:3001" + path;

  const fetchOptions: RequestInit = {
    method,
    headers: { ...headers }, // Spread headers to ensure it's a plain object
  };

  // Check if the body is FormData
  if (body instanceof FormData) {
    fetchOptions.body = body; // Directly attach FormData
  } else if (body) {
    // Ensure headers is a plain object and set Content-Type
    (fetchOptions.headers as Record<string, string>)["Content-Type"] =
      "application/json";
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetch(url, fetchOptions);

  // Handle non-JSON responses
  let data;
  try {
    data = await response.json();
  } catch (error) {
    console.warn("Response is not JSON:", error);
    data = null;
  }

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
