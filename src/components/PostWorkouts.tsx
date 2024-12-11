import React from "react";
import { Typography, Table } from "antd";
import { FeedExerciseRecord } from "@/types/feed";

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
            padding: "15px",
            marginBottom: "15px",
            border: "1px solid #e8e8e8",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
          }}
        >
          {/* Workout Subtype */}
          <Typography.Title
            level={5}
            style={{
              textAlign: "center",
              fontWeight: "bold",
              marginBottom: "5px",
            }}
          >
            {workout.subtype || "Workout"}
          </Typography.Title>

          <Typography.Text
            style={{
              textAlign: "center",
              display: "block",
              fontStyle: "italic",
              color: "gray",
            }}
          >
            {workout.type}
          </Typography.Text>

          {/* Render Exercises */}
          {workout.exercises && workout.exercises.length > 0 && (
            <Table
              dataSource={workout.exercises}
              columns={filterColumns(exerciseColumns, workout.exercises)}
              rowKey={(record) => record.id}
              pagination={false}
              bordered
              style={{ marginTop: "15px" }}
            />
          )}
        </div>
      ))}
    </>
  );
};

export default PostWorkouts;
