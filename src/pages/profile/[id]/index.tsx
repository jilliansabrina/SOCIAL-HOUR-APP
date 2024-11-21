import Navigation from "@/components/Navigation";
import { fetchUser } from "@/shared/datasource";
import { useLocalStorage } from "@/shared/hooks/useLocalStorage";
import { Avatar, Divider } from "antd";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

export default function () {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["fetch-user-by-id", router.query.id as string],
    queryFn: () => fetchUser(parseInt(router.query.id as string)),
  });

  console.log(data);

  return (
    <div>
      <Navigation />
      <div>
        <Avatar style={{ backgroundColor: "#85182a", color: "black" }}>
          {data?.data.username[0].toUpperCase()}
        </Avatar>
        <div>
          <h3>{`@${data?.data.username}`}</h3>
        </div>
      </div>
      <Divider />
      <div>
        <h3>Posts</h3>
        <div>
          {data?.data.posts && data?.data.posts.length > 0 ? (
            data?.data.posts.map((post: any) => (
              <div
                key={post.id}
                style={{
                  marginBottom: "15px",
                  border: "1px solid #ddd",
                  padding: "10px",
                }}
              >
                <p>{post.content}</p>
                <small>{new Date(post.timestamp).toLocaleString()}</small>
              </div>
            ))
          ) : (
            <p>Nothing to see here... yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
