import { FeedPostRecord } from "@/types/feed";
import { HeartTwoTone } from "@ant-design/icons";
import { Avatar, Button, Card, Flex, Space, Tooltip, Typography } from "antd";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { useRouter } from "next/router";

dayjs.extend(advancedFormat);

type Props = {
  post: FeedPostRecord;
};

export default function PostCardView({ post }: Props) {
  const now = dayjs();
  const date = dayjs(post.timestamp);
  const diff = now.diff(date, "day");
  const router = useRouter();

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
          <HeartTwoTone twoToneColor="#85182a" />
        </div>
      </Flex>
    </Card>
  );
}
