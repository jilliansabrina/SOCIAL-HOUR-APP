import { FeedPostRecord } from "@/types/feed";
import { Card, Flex, Space, Tooltip, Typography } from "antd";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);

type Props = {
  post: FeedPostRecord;
};

export default function PostCardView({ post }: Props) {
  const now = dayjs();
  const date = dayjs(post.timestamp);
  const diff = now.diff(date, "day");
  return (
    <Card>
      <Flex vertical>
        <Flex justify="space-between">
          <Typography.Text strong>{post.author.username}</Typography.Text>
          {/* Date as "Mon 13th of June 2024" */}
          <Tooltip title={date.format("ddd MMM Do YYYY h:mm A")}>
            <Typography.Text>{`${diff} days ago`}</Typography.Text>
          </Tooltip>
        </Flex>
        <Typography.Text>{post.content}</Typography.Text>
      </Flex>
    </Card>
  );
}
