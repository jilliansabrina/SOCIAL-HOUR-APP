import { FeedPostRecord, ProfilePostRecord, ProfileRecord } from "@/types/feed";
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

export async function fetchUser(username?: string | null) {
  const data = await apiCall<ProfileRecord>({
    method: HttpMethod.GET,
    path: `/api/users/${username}`,
  });
  return data.data;
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

export async function getFeed(username?: string | null) {
  if (!username) {
    return;
  }
  const data = await apiCall({
    method: HttpMethod.GET,
    path: `/api/feed`,
    headers: {
      Authorization: username,
    },
  });
  return data.data as FeedPostRecord[];
}

export async function createPostMutation(
  username: string,
  content: string,
  location?: string,
  duration?: number
) {
  return await apiCall({
    method: HttpMethod.POST,
    path: "/api/posts",
    body: {
      username,
      content,
      location,
      duration,
    },
  });
}
