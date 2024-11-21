export type FeedUserRecord = {
  id: number;
  username: string;
};

export type FeedCommentRecord = {
  id: number;
  content: string;
  timestamp: string;
  postId: number;
  authorId: number;
};

export type FeedLikeRecord = {
  id: number;
  timestamp: string;
  postId: number;
  authorId: number;
};

export type FeedPostRecord = {
  id: number;
  authorId: number;
  content: string;
  timestamp: string;
  workoutDuration: number | null;
  location: string | null;
  author: FeedUserRecord;
  comments: FeedCommentRecord[];
  likes: FeedLikeRecord[];
};

export type ProfileUserRecord = {
  id: number;
  username: string;
};

export type ProfileCommentRecord = {
  id: number;
  content: string;
  timestamp: string;
  postId: number;
  authorId: number;
};

export type ProfileLikeRecord = {
  id: number;
  timestamp: string;
  postId: number;
  authorId: number;
};

export type ProfilePostRecord = {
  id: number;
  authorId: number;
  content: string;
  timestamp: string;
  workoutDuration: number | null;
  location: string | null;
  author: ProfileUserRecord;
  comments: ProfileCommentRecord[];
  likes: ProfileLikeRecord[];
};

export type ProfileRecord = {
  posts: ProfilePostRecord[];
  id: number;
  username: string;
  email: string;
};
