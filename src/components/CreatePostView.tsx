import { Button, Modal, Input, message, Select, Typography } from "antd";
import { useState } from "react";
import { useMutation } from "react-query";
import { createPostMutation } from "@/shared/datasource";
import workoutData from "@/constants/workoutData";
import { PlusOutlined } from "@ant-design/icons";

import { Montserrat } from "next/font/google";
// Import Montserrat font
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500"], // Adjust weight for the title
});

type Exercise = {
  name: string;
  sets?: number;
  reps?: number;
  weight?: number;
  distance?: number;
  duration?: number;
  pace?: number;
};

type Workout = {
  type: string;
  subtype?: string;
  exercises: Exercise[];
};

type FormValues = {
  content: string;
  location?: string;
  workouts: Workout[];
  images?: File[];
};

type Props = {
  refetch: () => void;
};

export default function CreatePostView({ refetch }: Props) {
  const { mutate: createPost } = useMutation({
    mutationFn: async (formData: FormValues) => {
      if (!formData.workouts.length) {
        throw new Error("At least one workout is required.");
      }
      return await createPostMutation(
        formData.content,
        formData.location || "",
        formData.workouts,
        formData.images
      );
    },
    onSuccess: () => {
      message.success("Post created successfully!");
      setContent("");
      setLocation("");
      setWorkouts([{ type: "", subtype: "", exercises: [] }]);
      setFiles([]);
      refetch();
    },
    onError: (err) => {
      message.error("Failed to create post. Please try again.");
      console.error(err);
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [subtype, setSubtype] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([
    { type: "", subtype: "", exercises: [] },
  ]);
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Merge new files with existing ones, preventing duplicates
      const newFiles = Array.from(e.target.files).filter(
        (file) => !files.some((existingFile) => existingFile.name === file.name)
      );

      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const addWorkout = () => {
    setWorkouts([...workouts, { type: "", subtype: "", exercises: [] }]);
  };

  const updateWorkout = (
    workoutIndex: number,
    field: keyof Workout,
    value: any
  ) => {
    const updatedWorkouts = [...workouts];
    updatedWorkouts[workoutIndex] = {
      ...updatedWorkouts[workoutIndex],
      [field]: value,
    };
    setWorkouts(updatedWorkouts);
  };

  const deleteWorkout = (workoutIndex: number) => {
    setWorkouts((prev) => prev.filter((_, index) => index !== workoutIndex));
  };

  const addExercise = (workoutIndex: number) => {
    const updatedWorkouts = [...workouts];
    updatedWorkouts[workoutIndex].exercises.push({
      name: "",
      sets: undefined,
      reps: undefined,
      weight: undefined,
      distance: undefined,
      duration: undefined,
      pace: undefined,
    });
    setWorkouts(updatedWorkouts);
  };

  const updateExercise = (
    workoutIndex: number,
    exerciseIndex: number,
    field: keyof Exercise,
    value: any
  ) => {
    const updatedWorkouts = [...workouts];
    const updatedExercises = [...updatedWorkouts[workoutIndex].exercises];
    updatedExercises[exerciseIndex] = {
      ...updatedExercises[exerciseIndex],
      [field]: value,
    };
    updatedWorkouts[workoutIndex].exercises = updatedExercises;
    setWorkouts(updatedWorkouts);
  };

  const deleteExercise = (workoutIndex: number, exerciseIndex: number) => {
    setWorkouts((prev) => {
      const updatedWorkouts = [...prev];
      updatedWorkouts[workoutIndex].exercises = updatedWorkouts[
        workoutIndex
      ].exercises.filter((_, index) => index !== exerciseIndex);
      return updatedWorkouts;
    });
  };

  const handleSubmit = () => {
    console.log(
      "Payload:",
      JSON.stringify({ content, location, workouts, images: files })
    );

    createPost({ content, location, workouts, images: files });
    setIsModalOpen(false);
  };

  const getSubtypes = (type: string) => {
    const typeData = workoutData.find((workout) => workout.value === type);
    return typeData?.children?.map((child) => child.value) || [];
  };

  return (
    <div>
      <Button
        style={{
          backgroundColor: "#85182a",
          color: "white",
          borderRadius: "50px",
          fontWeight: "bold",
          padding: "15px 25px",
          fontSize: "18px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        }}
        icon={<PlusOutlined style={{ color: "white", fontSize: "22px" }} />}
        onClick={() => setIsModalOpen(true)}
      >
        Create Post
      </Button>

      <Modal
        title="Log Workout"
        open={isModalOpen}
        onCancel={() => {
          setFiles([]);
          setIsModalOpen(false);
          setExercises([]);
          setWorkouts([{ type: "", subtype: "", exercises: [] }]);
        }}
        footer={null}
      >
        {workouts.map((workout, workoutIndex) => (
          <div key={workoutIndex} style={{ marginBottom: "20px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography.Title level={4} style={{ margin: 0 }}>
                Workout {workoutIndex + 1}
              </Typography.Title>
              <Button
                type="link"
                danger
                onClick={() => deleteWorkout(workoutIndex)}
                style={{ margin: 0 }}
              >
                Delete Workout
              </Button>
            </div>

            <Select
              placeholder="Select a workout type"
              options={workoutData}
              value={workout.type || undefined}
              onChange={(value) => updateWorkout(workoutIndex, "type", value)}
              style={{ width: "100%", marginBottom: "5px" }}
            />
            <Select
              placeholder="Select Subtype"
              value={workout.subtype || undefined}
              onChange={(value) =>
                updateWorkout(workoutIndex, "subtype", value)
              }
              style={{ width: "100%", marginBottom: "10px" }}
              options={getSubtypes(workout.type).map((value) => ({
                value,
                label: value.charAt(0).toUpperCase() + value.slice(1),
              }))}
              disabled={!workout.type}
            />
            {workout.exercises.map((exercise, exerciseIndex) => (
              <div key={exerciseIndex} style={{ marginBottom: "10px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography.Title level={5} style={{ margin: 0 }}>
                    Exercise {exerciseIndex + 1}
                  </Typography.Title>
                  <Button
                    type="link"
                    danger
                    onClick={() => deleteExercise(workoutIndex, exerciseIndex)}
                    style={{ margin: 0 }}
                  >
                    Delete Exercise
                  </Button>
                </div>
                <Input
                  placeholder="Exercise Name"
                  value={exercise.name}
                  onChange={(e) =>
                    updateExercise(
                      workoutIndex,
                      exerciseIndex,
                      "name",
                      e.target.value
                    )
                  }
                  style={{ marginBottom: "5px" }}
                />
                <Input
                  placeholder="Sets"
                  value={exercise.sets}
                  type="number"
                  onChange={(e) =>
                    updateExercise(
                      workoutIndex,
                      exerciseIndex,
                      "sets",
                      parseInt(e.target.value, 10)
                    )
                  }
                  style={{ marginBottom: "5px" }}
                />
                <Input
                  placeholder="Reps"
                  value={exercise.reps}
                  type="number"
                  onChange={(e) =>
                    updateExercise(
                      workoutIndex,
                      exerciseIndex,
                      "reps",
                      parseInt(e.target.value, 10)
                    )
                  }
                  style={{ marginBottom: "5px" }}
                />
                <Input
                  placeholder="Weight"
                  value={exercise.weight}
                  type="number"
                  onChange={(e) =>
                    updateExercise(
                      workoutIndex,
                      exerciseIndex,
                      "weight",
                      parseFloat(e.target.value)
                    )
                  }
                  style={{ marginBottom: "5px" }}
                />
                <Input
                  placeholder="Distance"
                  value={exercise.distance}
                  type="number"
                  onChange={(e) =>
                    updateExercise(
                      workoutIndex,
                      exerciseIndex,
                      "distance",
                      parseFloat(e.target.value)
                    )
                  }
                  style={{ marginBottom: "5px" }}
                />
                <Input
                  placeholder="Duration"
                  value={exercise.duration}
                  type="number"
                  onChange={(e) =>
                    updateExercise(
                      workoutIndex,
                      exerciseIndex,
                      "duration",
                      parseFloat(e.target.value)
                    )
                  }
                  style={{ marginBottom: "5px" }}
                />
                <Input
                  placeholder="Pace"
                  value={exercise.pace}
                  type="number"
                  onChange={(e) =>
                    updateExercise(
                      workoutIndex,
                      exerciseIndex,
                      "pace",
                      parseFloat(e.target.value)
                    )
                  }
                  style={{ marginBottom: "5px" }}
                />
              </div>
            ))}
            <Button
              type="dashed"
              onClick={() => addExercise(workoutIndex)}
              style={{ marginBottom: "20px", width: "100%" }}
            >
              Add Exercises
            </Button>
          </div>
        ))}

        <Button
          type="dashed"
          onClick={addWorkout}
          style={{ marginBottom: "20px", width: "100%" }}
        >
          Add a new workout
        </Button>

        <Input.TextArea
          rows={2}
          placeholder="How was your workout?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ marginBottom: "10px" }}
        />
        <Input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{ marginBottom: "20px" }}
        />
        <div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="file-upload"
          />
          <Button
            onClick={() => document.getElementById("file-upload")?.click()}
            style={{ marginBottom: "10px", width: "100%" }}
            type="dashed"
          >
            Add Images
          </Button>
          {files.length > 0 && (
            <div style={{ marginBottom: "10px" }}>
              <Typography.Text>Selected Images:</Typography.Text>
              <ul>
                {files.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button type="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </Modal>
    </div>
  );
}
