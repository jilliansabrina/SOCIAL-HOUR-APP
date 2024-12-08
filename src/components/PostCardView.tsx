import { FeedExerciseRecord, FeedPostRecord } from "@/types/feed";
import { Avatar, Card, Table, Tooltip, Typography, Button } from "antd";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { useRouter } from "next/router";
import LikeButton from "./LikeButton";
import CommentButton from "./CommentButton";

dayjs.extend(advancedFormat);

type Props = {
  post: FeedPostRecord;
  refetch: () => void;
};

export default function PostCardView({ post, refetch }: Props) {
  const now = dayjs();
  const date = dayjs(post.timestamp);
  const diff = now.diff(date, "day");
  const router = useRouter();

  const handleDelete = () => {
    console.log("Delete post:", post.id); // Replace with actual delete logic
  };

  // All possible columns
  const exerciseColumns = [
    {
      title: "Exercise",
      dataIndex: "subcategory",
      key: "subcategory",
      render: (text: string) => <strong>{text || "N/A"}</strong>,
    },
    {
      title: "Distance (miles)",
      dataIndex: "distance",
      key: "distance",
      render: (value: number | null) =>
        value !== null && value !== undefined ? value : "N/A",
    },
    {
      title: "Duration (mins)",
      dataIndex: "duration",
      key: "duration",
      render: (value: number | null) =>
        value !== null && value !== undefined ? value : "N/A",
    },
    {
      title: "Pace (min/mile)",
      dataIndex: "pace",
      key: "pace",
      render: (value: number | null) =>
        value !== null && value !== undefined ? value : "N/A",
    },
    {
      title: "Sets",
      dataIndex: "sets",
      key: "sets",
      render: (value: number | null) =>
        value !== null && value !== undefined ? value : "N/A",
    },
    {
      title: "Reps",
      dataIndex: "reps",
      key: "reps",
      render: (value: number | null) =>
        value !== null && value !== undefined ? value : "N/A",
    },
    {
      title: "Weight (lbs)",
      dataIndex: "weight",
      key: "weight",
      render: (value: number | null) =>
        value !== null && value !== undefined ? value : "N/A",
    },
  ];

  // Filter out columns where all values in the data are null
  const filteredColumns = exerciseColumns.filter(
    (column) =>
      post.exercises &&
      Array.isArray(post.exercises) &&
      post.exercises.some((exercise) => {
        const field = column.dataIndex as keyof FeedExerciseRecord;
        return exercise[field] !== null && exercise[field] !== undefined;
      })
  );

  return (
    <Card
      style={{
        marginBottom: "20px",
        border: "1px solid #d9d9d9", // Light gray border for separation
        borderRadius: "8px", // Rounded corners
        overflow: "hidden",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
        backgroundColor: "#ffffff", // Ensure posts have a distinct white background
      }}
    >
      {/* Author Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px",
          backgroundColor: "#f0f2f5",
          borderBottom: "1px solid #e8e8e8",
        }}
      >
        <Avatar
          style={{
            backgroundColor: "#85182a",
            color: "white",
            marginRight: "10px",
          }}
        >
          {post.author.username[0]?.toUpperCase()}
        </Avatar>
        <div>
          <Typography.Text
            style={{
              fontWeight: "bold",
              cursor: "pointer",
              display: "block",
            }}
            onClick={() => router.push(`profile/${post.author.username}`)}
          >
            @{post.author.username}
          </Typography.Text>
          <Tooltip title={date.format("ddd MMM Do YYYY h:mm A")}>
            <Typography.Text type="secondary">
              {`Posted ${diff} days ago`}
            </Typography.Text>
          </Tooltip>
        </div>
      </div>

      {/* Workout Type */}
      <div
        style={{
          backgroundColor: "#fafafa",
          padding: "10px",
          textAlign: "center",
        }}
      >
        <Typography.Text strong style={{ fontSize: "16px" }}>
          {post.workoutType || "Workout"}
        </Typography.Text>
      </div>

      {/* Exercises Table */}
      {post.exercises && post.exercises.length > 0 && (
        <div style={{ padding: "15px" }}>
          <Table
            dataSource={post.exercises}
            columns={filteredColumns}
            rowKey="id" // Ensure a unique key for each row
            pagination={false} // Disable pagination for simplicity
            bordered
          />
        </div>
      )}

      {/* Content Bubble */}
      {post.content && (
        <div
          style={{
            padding: "15px",
            backgroundColor: "#f6f8fa",
            margin: "15px",
            borderRadius: "10px",
            border: "1px solid #e8e8e8",
          }}
        >
          <Typography.Text style={{ fontStyle: "italic" }}>
            {post.content}
          </Typography.Text>
        </div>
      )}

      {/* Actions: Like, Comment */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "15px",
          borderTop: "1px solid #e8e8e8",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <CommentButton
            comments={post.comments}
            postId={post.id}
            refetchPost={refetch}
          />
          <LikeButton postId={post.id} />
        </div>
        <Tooltip title={date.format("ddd MMM Do YYYY h:mm A")}>
          <Typography.Text type="secondary">{`${diff} days ago`}</Typography.Text>
        </Tooltip>
      </div>

      {/* Delete Button */}
      <div
        style={{
          textAlign: "right",
          padding: "10px 15px",
          borderTop: "1px solid #e8e8e8",
        }}
      >
        <Button danger onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </Card>
  );
}
