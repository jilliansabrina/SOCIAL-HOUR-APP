import Navigation from "@/components/Navigation";
import { fetchUser } from "@/shared/datasource";
import { Avatar, Button, Space } from "antd";
import { useQuery } from "react-query";
import PostCardView from "@/components/PostCardView";
import { useRouter } from "next/router";
import { useUsername } from "@/shared/hooks/useLocalStorage";

export default function () {
  const router = useRouter();
  const username = router.query.username as string;
  const [loggedUser] = useUsername();

  const { data } = useQuery({
    queryKey: ["fetch-user", username],
    queryFn: () => fetchUser(username),
  });
  return (
    <div>
      <Navigation />
      <div>
        <Avatar style={{ backgroundColor: "#85182a", color: "black" }}>
          {(username ?? " ")[0]?.toUpperCase()}
        </Avatar>
        <h1>{`@${username}`}</h1>
        {username == loggedUser ? (
          <Button>Edit Profile</Button>
        ) : (
          <Button>Follow</Button>
        )}
      </div>
      {(data?.posts.length ?? 0) > 0 ? (
        data?.posts.map((post) => {
          return (
            <Space
              key={post.id}
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
