import { FeedPostRecord, ProfileRecord } from "@/types/feed";
import { apiCall, HttpMethod } from "./fetch";
import { forceLoadUsername } from "./hooks/useLocalStorage";

function generateHeaders() {
  const headers: any = {};
  const username = forceLoadUsername();
  if (username) {
    headers["Authorization"] = username;
  }
  return headers;
}

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
  const data = await apiCall<ProfileRecord>({
    method: HttpMethod.GET,
    path: `/api/users/${username}`,
    headers: generateHeaders(),
  });
  return data.data;
}

export async function followUser(username: string) {
  const data = await apiCall<ProfileRecord>({
    method: HttpMethod.POST,
    path: `/api/follow/${username}`,
    headers: generateHeaders(),
  });
  return data.data;
}

export async function unfollowUser(username: string) {
  const data = await apiCall<ProfileRecord>({
    method: HttpMethod.DELETE,
    path: `/api/follow/${username}`,
    headers: generateHeaders(),
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

export async function fetchLikes(postId: number) {
  const response = await apiCall({
    method: HttpMethod.GET,
    path: `/api/posts/${postId}/likes`,
  });
  return response.data || [];
}

export async function likePost(postId: number, userId: number) {
  return await apiCall({
    method: HttpMethod.POST,
    path: `/api/posts/${postId}/likes`,
    body: { userId },
  });
}

export async function unlikePost(postId: number, userId: number) {
  const username = forceLoadUsername();
  return await apiCall({
    method: HttpMethod.DELETE,
    path: `/api/posts/${postId}/likes`,
    body: { userId },
  });
}

export async function getFeed() {
  const data = await apiCall({
    method: HttpMethod.GET,
    path: `/api/feed`,
    headers: generateHeaders(),
  });
  return data.data as FeedPostRecord[];
}

export async function fetchFollowers(username: string) {
  const data = await apiCall({
    method: HttpMethod.GET,
    path: `/api/users/${username}/followers`,
    headers: generateHeaders(),
  });
  return data || []; // Return an empty array if no data is found
}

export async function fetchFollowing(username: string) {
  const data = await apiCall({
    method: HttpMethod.GET,
    path: `/api/users/${username}/following`,
    headers: generateHeaders(),
  });
  return data || []; // Return an empty array if no data is found
}

export async function createPostMutation(
  content: string,
  location?: string,
  duration?: number
) {
  const username = forceLoadUsername();
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

export async function addCommentMutation(
  postId: number,
  authorId: number,
  content: string
) {
  const username = forceLoadUsername();
  return await apiCall({
    method: HttpMethod.POST,
    path: "/api/comments",
    body: {
      postId,
      authorId,
      content,
    },
  });
}

export async function deleteCommentMutation(commentId: number) {
  return await apiCall({
    method: HttpMethod.DELETE,
    path: `/api/comments/${commentId}`,
  });
}
