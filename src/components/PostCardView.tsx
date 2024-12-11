import { FeedExerciseRecord, FeedPostRecord } from "@/types/feed";
import { Card } from "antd";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { useRouter } from "next/router";
import PostImages from "./PostImages";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostWorkouts from "./PostWorkouts";
import PostButtons from "./PostButtons";

dayjs.extend(advancedFormat);

type Props = {
  post: FeedPostRecord;
  refetch: () => void;
};

export default function PostCardView({ post, refetch }: Props) {
  const now = dayjs();
  const date = dayjs(post.timestamp);
  const diff = now.diff(date, "day");

  const handleDelete = () => {
    console.log("Delete post:", post.id); // Replace with actual delete logic
  };

  // Define exercise columns
  const exerciseColumns = [
    {
      title: "Exercise Name",
      dataIndex: "name",
      key: "name",
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

  // Filter columns where all values are "N/A"
  const filterColumns = (columns: any[], data: FeedExerciseRecord[]) => {
    return columns.filter((column) => {
      const allValuesAreNA = data.every(
        (record) => column.render(record[column.dataIndex]) === "N/A"
      );
      return !allValuesAreNA;
    });
  };

  return (
    <Card
      style={{
        marginBottom: "20px",
        border: "1px solid #d9d9d9",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#ffffff",
      }}
    >
      {/* Post Header */}
      <PostHeader
        author={post.author}
        location={post.location}
        date={date}
        diff={diff}
      />

      <PostWorkouts
        workouts={post.workouts}
        filterColumns={filterColumns}
        exerciseColumns={exerciseColumns}
      />

      <PostImages images={post.images} />

      <PostContent content={post.content} />

      {/* Post Buttons */}
      <PostButtons
        postId={post.id}
        comments={post.comments}
        refetchPost={refetch}
        author={post.author.username}
      />
    </Card>
  );
}
