import { Button, Modal, Input, message, Select } from "antd";
import { useState } from "react";
import { useMutation } from "react-query";
import { createPostMutation } from "@/shared/datasource";
import workoutData from "@/constants/workoutData";
import { PlusOutlined } from "@ant-design/icons";

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
        formData.workouts
      );
    },
    onSuccess: () => {
      message.success("Post created successfully!");
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

  const addExercise = () => {
    setExercises([
      ...exercises,
      { name: "", sets: undefined, reps: undefined, weight: undefined },
    ]);
  };

  const updateExercise = (index: number, field: keyof Exercise, value: any) => {
    const updatedExercises = [...exercises];
    updatedExercises[index] = { ...updatedExercises[index], [field]: value };
    setExercises(updatedExercises);
  };

  const handleSubmit = () => {
    const workouts = [{ type, subtype, exercises }];
    createPost({ content, location, workouts });
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
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Select
          placeholder="Select a workout type"
          options={workoutData} // Options for the dropdown
          value={type || undefined}
          onChange={setType} // Updates state on selection
          style={{ width: "100%", marginTop: "5px" }}
        />
        <Select
          placeholder="Select Subtype"
          style={{ width: "100%", marginBottom: "10px" }}
          value={subtype || undefined}
          onChange={(value) => setSubtype(value)}
          options={getSubtypes(type).map((value) => ({
            value,
            label: value.charAt(0).toUpperCase() + value.slice(1), // Capitalize for display
          }))}
          disabled={!type} // Disabled until type is selected
        />
        <Button
          type="dashed"
          onClick={addExercise}
          style={{ marginBottom: "20px", width: "100%" }}
        >
          Add Exercise
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
        {exercises.map((exercise, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <Input
              placeholder="Exercise Name"
              value={exercise.name}
              onChange={(e) => updateExercise(index, "name", e.target.value)}
              style={{ marginBottom: "5px" }}
            />
            <Input
              placeholder="Sets"
              value={exercise.sets}
              type="number"
              onChange={(e) =>
                updateExercise(index, "sets", parseInt(e.target.value, 10))
              }
              style={{ marginBottom: "5px" }}
            />
            <Input
              placeholder="Reps"
              value={exercise.reps}
              type="number"
              onChange={(e) =>
                updateExercise(index, "reps", parseInt(e.target.value, 10))
              }
              style={{ marginBottom: "5px" }}
            />
            <Input
              placeholder="Weight"
              value={exercise.weight}
              type="number"
              onChange={(e) =>
                updateExercise(index, "weight", parseFloat(e.target.value))
              }
              style={{ marginBottom: "5px" }}
            />
            <Input
              placeholder="Distance"
              value={exercise.distance}
              type="number"
              onChange={(e) =>
                updateExercise(index, "distance", parseFloat(e.target.value))
              }
              style={{ marginBottom: "5px" }}
            />
            <Input
              placeholder="Duration"
              value={exercise.duration}
              type="number"
              onChange={(e) =>
                updateExercise(index, "duration", parseFloat(e.target.value))
              }
              style={{ marginBottom: "5px" }}
            />
            <Input
              placeholder="pace"
              value={exercise.pace}
              type="number"
              onChange={(e) =>
                updateExercise(index, "pace", parseFloat(e.target.value))
              }
              style={{ marginBottom: "5px" }}
            />
          </div>
        ))}
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
