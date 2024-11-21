import { fetchLikes } from "@/shared/datasource";
import { FeedPostRecord } from "@/types/feed";
import { HeartTwoTone } from "@ant-design/icons";
import { Avatar, Button, Card, Flex, Space, Tooltip, Typography } from "antd";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import LikeButton from "./LikeButton";

dayjs.extend(advancedFormat);

type Props = {
  post: FeedPostRecord;
};

export default function PostCardView({ post }: Props) {
  const now = dayjs();
  const date = dayjs(post.timestamp);
  const diff = now.diff(date, "day");
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["fetch-likes", post.id],
    queryFn: () => fetchLikes(post.id),
  });

  const likes = typeof data === "number" ? data : 0;

  return (
    <Card>
      <Flex vertical>
        <Flex justify="space-between">
          <div>
            <Avatar style={{ backgroundColor: "#85182a", color: "black" }}>
              {post.author.username[0]?.toUpperCase()}
            </Avatar>
            <Typography.Text
              style={{ cursor: "pointer" }}
              onClick={() => router.push(`profile/${post.author.username}`)}
              strong
            >
              {`@${post.author.username}`}
            </Typography.Text>
          </div>
          {/* Date as "Mon 13th of June 2024" */}
          <Tooltip title={date.format("ddd MMM Do YYYY h:mm A")}>
            <Typography.Text>{`Posted ${diff} days ago`}</Typography.Text>
          </Tooltip>
        </Flex>
        <Typography.Text>{post.content}</Typography.Text>
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
          <LikeButton postId={post.id} />
        </div>
      </Flex>
    </Card>
  );
}
