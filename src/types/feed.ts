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
