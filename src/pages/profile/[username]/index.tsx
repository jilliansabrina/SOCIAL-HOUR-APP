import Navigation from "@/components/Navigation";
import { fetchUser } from "@/shared/datasource";
import { useUsername } from "@/shared/hooks/useLocalStorage";
import { Space } from "antd";
import { useEffect } from "react";
import { useQuery } from "react-query";
import PostCardView from "@/components/PostCardView";
import { useRouter } from "next/router";

export default function () {
  const router = useRouter();
  const username = router.query.username as string;

  const { data } = useQuery({
    queryKey: ["fetch-user", username],
    queryFn: () => fetchUser(username),
  });
  useEffect(() => {
    console.log(data);
  }, [data]);
  return (
    <div>
      <Navigation />
      {(data?.posts.length ?? 0) > 0 ? (
        data?.posts.map((post) => {
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
