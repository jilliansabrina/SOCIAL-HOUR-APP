export type FeedCommentRecord = {
  id: number;
  content: string;
  timestamp: string;
  postId: number;
  author: FeedUserRecord;
};

export type FeedUserRecord = {
  id: number;
  username: string;
};

export type FeedLikeRecord = {
  id: number;
  timestamp: string;
  postId: number;
  authorId: number;
};

export type FeedExerciseRecord = {
  id: number;
  name: string;
  sets?: number | null;
  reps?: number | null;
  distance?: number | null;
  duration?: number | null;
  pace?: number | null;
  weight?: number | null;
  [key: string]: string | number | null | undefined; // Add index signature
};

export type FeedWorkoutRecord = {
  id: number;
  type: string;
  subtype?: string | null;
  exercises: FeedExerciseRecord[];
};

export type FeedPostRecord = {
  id: number;
  authorId: number;
  content: string;
  timestamp: string;
  location: string | null;
  author: FeedUserRecord;
  workouts: FeedWorkoutRecord[];
  comments: FeedCommentRecord[];
  likes: FeedLikeRecord[];
  images: FeedImageRecord[] | null;
};

export type FeedImageRecord = {
  id: number;
  objectPath: string; // Path or URL to the image
};

export type ProfileRecord = {
  id: number;
  username: string;
  posts: FeedPostRecord[];
  followers: FeedUserRecord[];
};

export type Exercise = {
  name: string;
  sets?: number;
  reps?: number;
  weight?: number;
  distance?: number;
  duration?: number;
  pace?: number;
};

export type Workout = {
  type: string;
  subtype?: string;
  exercises: Exercise[];
};
