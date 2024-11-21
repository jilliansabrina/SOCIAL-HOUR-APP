import CreatePostView from "@/components/CreatePostView";
import Navigation from "@/components/Navigation";
import PostCardView from "@/components/PostCardView";
import { getFeed } from "@/shared/datasource";
import { Space } from "antd";
import { useQuery } from "react-query";

export default function () {
  const { data = [] } = useQuery({
    queryKey: ["fetch-posts"],
    queryFn: () => getFeed(),
  });
  return (
    <div>
      <Navigation />
      <h2>Feed page.</h2>
      <CreatePostView />
      {data.length > 0 ? (
        data.map((post) => {
          return (
            <Space
              direction="vertical"
              style={{
                display: "flex",
              }}
            >
              <PostCardView post={post} />
            </Space>
          );
        })
      ) : (
        <p>Nothing to see here... yet</p>
      )}
    </div>
  );
}
