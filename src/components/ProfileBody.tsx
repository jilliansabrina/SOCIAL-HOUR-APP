import { useQuery } from "react-query";
import { Space } from "antd";
import { fetchUser } from "@/shared/datasource";
import PostCardView from "@/components/PostCardView";
import { FeedPostRecord } from "@/types/feed";

interface ProfileBodyProps {
  username: string;
}

export default function ProfileBody({ username }: ProfileBodyProps) {
  const { data: profileData, isLoading } = useQuery({
    queryKey: ["fetch-user", username],
    queryFn: () => fetchUser(username),
  });

  if (isLoading) return <p>Loading posts...</p>;

  const posts = profileData?.posts ?? [];

  return (
    <div>
      {posts.length > 0 ? (
        posts.map((post: FeedPostRecord) => (
          <Space
            key={post.id}
            direction="vertical"
            style={{
              display: "flex",
            }}
          >
            <PostCardView post={post} />
          </Space>
        ))
      ) : (
        <p>Nothing to see here... yet</p>
      )}
    </div>
  );
}
