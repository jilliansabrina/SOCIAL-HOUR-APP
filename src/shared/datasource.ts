import { apiCall, HttpMethod } from "./fetch";

export async function createUser(
  email: string,
  username: string,
  password: string,
  height?: number,
  weight?: number,
  bodyFat?: number
) {
  return await apiCall({
    method: HttpMethod.POST,
    path: "/users",
    body: { email, username, password, height, weight, bodyFat },
  });
}

export async function getPost(postId: Number) {
  return await apiCall({
    method: HttpMethod.GET,
    path: `/api/posts/${postId}`,
  });
}
