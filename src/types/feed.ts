export type FeedUserRecord = {
  id: number;
  username: string;
};

export type FeedCommentRecord = {
  id: number;
  content: string;
  timestamp: string;
  postId: number;
  author: FeedUserRecord;
};

export type FeedLikeRecord = {
  id: number;
  timestamp: string;
  postId: number;
  authorId: number;
};

export type FeedExerciseRecord = {
  id: number;
  subcategory?: string | null;
  sets?: number | null;
  reps?: number | null;
  distance?: number | null;
  duration?: number | null;
  pace?: number | null;
  weight?: number | null;
  [key: string]: string | number | null | undefined; // Add index signature
};

export type FeedPostRecord = {
  id: number;
  authorId: number;
  content: string;
  timestamp: string;
  location: string | null;
  author: FeedUserRecord;
  workoutType: string;
  comments: FeedCommentRecord[];
  likes: FeedLikeRecord[];
  exercises: FeedExerciseRecord[];
};

export type ProfileRecord = {
  id: number;
  username: string;
  posts: FeedPostRecord[];
  followers: FeedUserRecord[];
};
