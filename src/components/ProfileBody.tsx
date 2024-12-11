import { useQuery } from "react-query";
import { Space, Typography } from "antd";
import { fetchUser } from "@/shared/datasource";
import PostCardView from "@/components/PostCardView";
import { FeedPostRecord } from "@/types/feed";

interface ProfileBodyProps {
  username: string;
}

export default function ProfileBody({ username }: ProfileBodyProps) {
  const {
    data: profileData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["fetch-user", username],
    queryFn: () => fetchUser(username),
  });

  if (isLoading) return <Typography.Text>Loading posts...</Typography.Text>;
  if (isError)
    return (
      <Typography.Text type="danger">
        Failed to load profile. Please try again later.
      </Typography.Text>
    );

  // Extract posts from profile data
  const posts: FeedPostRecord[] = profileData?.posts || [];

  return (
    <div
      style={{
        maxWidth: "800px", // Limit the width of the content
        margin: "0 auto", // Center the content horizontally
        padding: "20px", // Add some padding for better readability
      }}
    >
      {posts.length > 0 ? (
        <Space
          direction="vertical"
          size="large"
          style={{
            width: "100%", // Ensure the Space component spans the full width
          }}
        >
          {posts.map((post) => (
            <PostCardView key={post.id} post={post} refetch={() => null} />
          ))}
        </Space>
      ) : (
        <Typography.Text>
          No posts to display yet. Start sharing your progress!
        </Typography.Text>
      )}
    </div>
  );
}
