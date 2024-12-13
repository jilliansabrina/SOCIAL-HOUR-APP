import React from "react";
import { Typography, Table } from "antd";
import { FeedExerciseRecord } from "@/types/feed";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300"],
});

interface Workout {
  subtype?: string | null;
  type: string;
  exercises?: FeedExerciseRecord[]; // Optional array of exercises
}

interface PostWorkoutsProps {
  workouts?: Workout[] | null;
  filterColumns: (columns: any[], exercises: FeedExerciseRecord[]) => any[]; // Function to filter columns
  exerciseColumns: any[]; // Columns for the exercise table
}

const PostWorkouts: React.FC<PostWorkoutsProps> = ({
  workouts,
  filterColumns,
  exerciseColumns,
}) => {
  if (!workouts || workouts.length === 0) return null;

  return (
    <>
      {workouts.map((workout, workoutIndex) => (
        <div
          key={workoutIndex}
          style={{
            padding: "10px 15px", // Adjusted padding for the container
            marginBottom: "15px",
            border: "1px solid #e8e8e8",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
          }}
        >
          {/* Workout Subtype */}
          <Typography.Title
            className={`${montserrat.className}`}
            level={5}
            style={{
              textAlign: "center",
              fontWeight: "bold",
              margin: "0", // No top margin
              paddingBottom: "2px", // Reduced padding for tighter spacing
              fontSize: "1em",
            }}
          >
            {workout.subtype || "Workout"}
          </Typography.Title>

          <Typography.Text
            className={`${montserrat.className}`}
            style={{
              textAlign: "center",
              display: "block",
              fontStyle: "italic",
              color: "gray",
              margin: "0", // No extra margin
              paddingTop: "0px", // Reduced padding for closer spacing
              fontSize: "0.9em",
            }}
          >
            {workout.type}
          </Typography.Text>

          {/* Render Exercises */}
          {workout.exercises && workout.exercises.length > 0 && (
            <Table
              dataSource={workout.exercises}
              columns={filterColumns(
                exerciseColumns.map((col) => ({
                  ...col,
                  align: col.dataIndex === "name" ? "left" : "center", // Center all except "name"
                  ellipsis: true, // Add ellipsis for overflow text
                })),
                workout.exercises
              )}
              rowKey={(record) => record.id}
              pagination={false}
              bordered
              style={{
                marginTop: "10px",
                fontSize: "0.9em", // Smaller font size for the table
              }}
              rowClassName={() => "exercise-table-row"}
              tableLayout="auto" // Dynamically adjust column width
            />
          )}
        </div>
      ))}
      <style jsx global>{`
        .exercise-table-row {
          padding: 4px 6px !important; /* Reduce padding for table rows */
        }
        .ant-table-cell {
          padding: 6px 8px !important; /* Adjust padding for all cells */
          word-wrap: break-word; /* Enable word wrapping */
        }
        .ant-table-thead > tr > th {
          padding: 6px 8px !important; /* Reduce padding for table headers */
        }
      `}</style>
    </>
  );
};

export default PostWorkouts;
