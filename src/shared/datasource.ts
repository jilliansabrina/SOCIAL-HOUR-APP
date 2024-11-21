import { apiCall, HttpMethod } from "./fetch";

export async function fetchCreateUser(
  email: string,
  username: string,
  password: string,
  height?: number,
  weight?: number,
  bodyFat?: number
) {
  return await apiCall({
    method: HttpMethod.POST,
    path: "/api/users",
    body: { email, username, password, height, weight, bodyFat },
  });
}

export async function fetchUser(username: string) {
  return await apiCall({
    method: HttpMethod.GET,
    path: `/api/users/${username}`,
  });
}

export async function fetchAllUsers() {
  return await apiCall({
    method: HttpMethod.GET,
    path: `/api/users`,
  });
}

type SignInResponse = {
  user: {
    email: string;
    id: number;
    username: string;
  };
};

export async function fetchSignIn(username: string, password: string) {
  return await apiCall<SignInResponse>({
    method: HttpMethod.POST,
    path: "/api/signin",
    body: { username, password },
  });
}

export async function getPost(postId: Number) {
  return await apiCall({
    method: HttpMethod.GET,
    path: `/api/posts/${postId}`,
  });
}
