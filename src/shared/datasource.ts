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
  password: string
) {
  return await apiCall({
    method: HttpMethod.POST,
    path: "/api/users",
    body: { email, username, password },
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
  workouts?: Array<{
    type: string;
    subtype?: string;
    exercises: Array<{
      name: string;
      sets?: number;
      reps?: number;
      weight?: number;
      distance?: number;
      duration?: number;
      pace?: number;
    }>;
  }>,
  images?: File[] // Include images for the post
) {
  const username = forceLoadUsername();

  // Create FormData object
  const formData = new FormData();
  if (username) formData.append("username", username); // Include username in the form data
  formData.append("content", content);
  if (location) formData.append("location", location);
  formData.append("workouts", JSON.stringify(workouts));
  if (images) {
    images.forEach((image) => {
      formData.append("images", image);
    });
  }

  console.log("Creating post with data:", formData);

  // Use `apiCall` or fetch directly
  return await apiCall({
    method: HttpMethod.POST,
    path: "/api/posts",
    body: formData,
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

export async function deletePostMutation(postId: number) {
  return await apiCall({
    method: HttpMethod.DELETE,
    path: `/api/posts/${postId}`,
  });
}

export async function deleteCommentMutation(commentId: number) {
  return await apiCall({
    method: HttpMethod.DELETE,
    path: `/api/comments/${commentId}`,
  });
}

export async function updateUsername(
  currentUsername: string,
  newUsername: string
) {
  return await apiCall({
    method: HttpMethod.PATCH,
    path: `/api/users/${currentUsername}`,
    body: {
      newUsername,
    },
    headers: {
      "Content-Type": "application/json",
      Authorization: currentUsername,
    },
  });
}

export async function fetchUserPostsByYear(username: string, year: number) {
  // Ensure the username and year are valid
  if (!username || !year) {
    throw new Error("Username and year are required.");
  }
  const data = await apiCall<Array<{ date: string; count: number }>>({
    method: HttpMethod.GET,
    path: `/api/users/${username}/posts?year=${year}`, // Pass the year as a query parameter
    headers: generateHeaders(),
  });

  return data; // Return the fetched data
}

export async function fetchWorkoutStats(username: string) {
  const data = await apiCall<
    Array<{ type: string; subtype: string; count: number }>
  >({
    method: HttpMethod.GET,
    path: `/api/users/${username}/workout-stats`,
    headers: generateHeaders(),
  });

  return data;
}

const processWorkoutStats = (
  stats: Array<{ type: string; subtype: string; count: number }>
) => {
  const groupedData: { [type: string]: { [subtype: string]: number } } = {};

  stats.forEach(({ type, subtype, count }) => {
    if (!groupedData[type]) {
      groupedData[type] = {};
    }
    groupedData[type][subtype] = count;
  });

  const chartData: Array<{ type: string; subtype: string; count: number }> = [];
  for (const type in groupedData) {
    for (const subtype in groupedData[type]) {
      chartData.push({
        type,
        subtype,
        count: groupedData[type][subtype],
      });
    }
  }

  return chartData;
};
