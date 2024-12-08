import CreatePostView from "@/components/CreatePostView";
import Navigation from "@/components/Navigation";
import PostCardView from "@/components/PostCardView";
import { getFeed } from "@/shared/datasource";
import { Space } from "antd";
import { useQuery } from "react-query";

export default function FeedPage() {
  const { data = [], refetch } = useQuery({
    queryKey: ["fetch-posts"],
    queryFn: () => getFeed(),
  });

  return (
    <div style={{ backgroundColor: "#f6f8fa", minHeight: "100vh" }}>
      <Navigation />
      <div
        style={{
          maxWidth: "800px", // Restricts the content width
          margin: "0 auto", // Centers the content horizontally
          padding: "20px", // Adds spacing
        }}
      >
        {/* Post Feed */}
        {data.length > 0 ? (
          <Space
            direction="vertical"
            style={{
              display: "flex",
              gap: "20px",
            }}
          >
            {data.map((post) => (
              <PostCardView key={post.id} post={post} refetch={refetch} />
            ))}
          </Space>
        ) : (
          <p style={{ textAlign: "center", color: "gray" }}>
            Nothing to see here... yet
          </p>
        )}
      </div>

      {/* Fixed Create Post Button */}
      <div
        style={{
          position: "fixed", // Keeps it fixed on the screen
          bottom: "20px", // Position from the bottom of the screen
          right: "50%", // Align to the center horizontally
          transform: "translateX(50%)", // Adjust for exact centering
          zIndex: 1000, // Ensures the button is above other content
        }}
      >
        <CreatePostView refetch={refetch} />
      </div>
    </div>
  );
}
