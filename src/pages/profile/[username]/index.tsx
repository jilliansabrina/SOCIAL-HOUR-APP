import Navigation from "@/components/Navigation";
import { fetchUser } from "@/shared/datasource";
import { HeartTwoTone } from "@ant-design/icons";
import { Avatar, Button, Card, Divider, Space } from "antd";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

export default function () {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["fetch-user-by-username", router.query.username as string],
    queryFn: () => fetchUser(router.query.username as string),
  });

  return (
    <div>
      <Navigation />
      <div>
        <Avatar style={{ backgroundColor: "#85182a", color: "black" }}>
          {data?.data?.username[0]?.toUpperCase()}
        </Avatar>
        <div>
          <h3>{`@${data?.data?.username}`}</h3>
        </div>
      </div>
      <Divider />
      <div>
        <h3>Posts</h3>
        <div>
          {data?.data?.posts && data?.data.posts.length > 0 ? (
            data?.data?.posts.map((post: any) => (
              <div
                key={post.id}
                style={{
                  marginBottom: "15px",
                  border: "1px solid #ddd",
                  padding: "10px",
                }}
              >
                <Space direction="vertical" size={16} style={{ width: "50%" }}>
                  <Card
                    style={{
                      borderRadius: "10px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      border: "1px solid #e8e8e8",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "16px",
                      }}
                    >
                      <Avatar
                        style={{
                          backgroundColor: "#85182a",
                          color: "#fff",
                          marginRight: "10px",
                        }}
                      >
                        {data?.data.username[0].toUpperCase()}
                      </Avatar>
                      <h3 style={{ margin: 0, fontWeight: "bold" }}>
                        {`@${data?.data.username}`}
                      </h3>
                    </div>
                    <p style={{ fontSize: "16px", lineHeight: "1.5" }}>
                      {post.content}
                    </p>
                    <Divider />
                    <p style={{ color: "#888", marginBottom: "16px" }}>
                      Shared on {new Date(post.timestamp).toLocaleString()}
                    </p>

                    {/* Action Buttons: Comment Button and Like Icon */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <Button
                        style={{
                          backgroundColor: "#85182a",
                          borderColor: "#85182a",
                          color: "white",
                        }}
                        type="primary"
                      >
                        Comment
                      </Button>
                      <HeartTwoTone twoToneColor="#85182a" />
                    </div>
                  </Card>
                </Space>
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
