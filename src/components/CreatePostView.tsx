import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Modal,
  TreeSelect,
  Input,
  Form,
  Table,
  message,
  Typography,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { createPostMutation } from "@/shared/datasource";
import { useUsername } from "@/shared/hooks/useLocalStorage";

type Exercise = {
  subcategory?: string;
  sets?: number;
  reps?: number;
  weight?: number;
  distance?: number;
  duration?: number;
  pace?: number;
};

type FormValues = {
  content: string;
  workoutType: string;
  location?: string;
  exercises: Exercise[];
};

type Props = {
  refetch: () => void;
};

const workoutData = [
  {
    value: "cardio",
    title: "Cardio",
    children: [
      { value: "cardio.running", title: "Running" },
      { value: "cardio.walking", title: "Walking" },
      { value: "cardio.stairmaster", title: "Stairmaster" },
      { value: "cardio.cycling", title: "Cycling" },
    ],
  },
  {
    value: "strength",
    title: "Strength Training",
    children: [
      { value: "strength.bodybuilding", title: "Bodybuilding" },
      { value: "strength.circuit", title: "Circuit" },
      { value: "strength.powerlifting", title: "Powerlifting" },
    ],
  },
  {
    value: "flexibility",
    title: "Flexibility",
    children: [
      { value: "flexibility.yoga", title: "Yoga" },
      { value: "flexibility.pilates", title: "Pilates" },
      { value: "flexibility.stretching", title: "Stretching" },
    ],
  },
  {
    value: "other",
    title: "Other",
    children: [
      { value: "other.dancing", title: "Dancing" },
      { value: "other.swimming", title: "Swimming" },
    ],
  },
];

type StrengthExercise = {
  key: number;
  exercise: string;
  sets: string;
  reps: string;
  weight: string;
};

export default function ({ refetch }: Props) {
  const {
    mutate: createPost,
    error,
    data,
  } = useMutation({
    mutationKey: "createPostMutation",
    mutationFn: async (data: FormValues) => {
      if (!data.workoutType) {
        throw new Error("Workout type is required");
      }
      return await createPostMutation(
        data.workoutType,
        data.content,
        data.location || "",
        data.exercises
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
  const [workout, setWorkout] = useState("");
  const [selectedWorkout, setSelectedWorkout] = useState<string | undefined>(
    undefined
  );
  const [location, setLocation] = useState("");
  const [strengthExercises, setStrengthExercises] = useState<
    StrengthExercise[]
  >([]);
  const [cardioDetails, setCardioDetails] = useState({
    distance: "",
    duration: "",
    pace: "",
  });

  const [username] = useUsername();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const addStrengthExercise = () => {
    setStrengthExercises([
      ...strengthExercises,
      {
        key: strengthExercises.length,
        exercise: "",
        sets: "",
        reps: "",
        weight: "",
      },
    ]);
  };

  const updateStrengthExercise = (
    index: number,
    field: keyof StrengthExercise,
    value: string
  ) => {
    const updatedExercises = [...strengthExercises];
    updatedExercises[index] = { ...updatedExercises[index], [field]: value };
    setStrengthExercises(updatedExercises);
  };

  useEffect(() => {
    if (data?.data) {
      setContent("");
      setLocation("");
      setStrengthExercises([]);
      setCardioDetails({ distance: "", duration: "", pace: "" });
      setIsModalOpen(false);
    }
  }, [data]);

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
          transition: "all 0.3s ease",
        }}
        shape="round"
        icon={<PlusOutlined style={{ color: "white", fontSize: "22px" }} />}
        onClick={showModal}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "#9b1e34")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "#85182a")
        }
      >
        Create Post
      </Button>

      <Modal
        title={
          <div style={{ textAlign: "center", fontWeight: "bold" }}>
            Share Your Progress
          </div>
        }
        open={isModalOpen}
        footer={null}
        closable={false}
        centered
        style={{
          maxWidth: "600px",
          margin: "auto",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <TreeSelect
            showSearch
            style={{ width: "100%" }}
            value={selectedWorkout}
            dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
            placeholder="Select workout type"
            allowClear
            treeDefaultExpandAll
            onChange={(value) => {
              setSelectedWorkout(value);
              const parentWorkout =
                workoutData.find((category) =>
                  category.children?.some((child) => child.value === value)
                )?.value || value;
              setWorkout(parentWorkout);
            }}
            treeData={workoutData}
          />
        </div>
        {workout === "strength" && (
          <div style={{ marginTop: "20px" }}>
            <Typography.Text
              strong
              style={{
                marginBottom: "10px",
                display: "block",
              }}
            >
              Enter Strength Exercise Details:
            </Typography.Text>
            <div style={{ marginBottom: "20px" }}>
              <Table
                dataSource={strengthExercises}
                columns={[
                  {
                    title: "Exercise",
                    dataIndex: "exercise",
                    render: (_, record, index) => (
                      <Input
                        placeholder="Exercise"
                        value={record.exercise}
                        onChange={(e) =>
                          updateStrengthExercise(
                            index,
                            "exercise",
                            e.target.value
                          )
                        }
                      />
                    ),
                  },
                  {
                    title: "Sets",
                    dataIndex: "sets",
                    render: (_, record, index) => (
                      <Input
                        placeholder="Sets"
                        value={record.sets}
                        onChange={(e) =>
                          updateStrengthExercise(index, "sets", e.target.value)
                        }
                      />
                    ),
                  },
                  {
                    title: "Reps",
                    dataIndex: "reps",
                    render: (_, record, index) => (
                      <Input
                        placeholder="Reps"
                        value={record.reps}
                        onChange={(e) =>
                          updateStrengthExercise(index, "reps", e.target.value)
                        }
                      />
                    ),
                  },
                  {
                    title: "Weight",
                    dataIndex: "weight",
                    render: (_, record, index) => (
                      <Input
                        placeholder="Weight"
                        value={record.weight}
                        onChange={(e) =>
                          updateStrengthExercise(
                            index,
                            "weight",
                            e.target.value
                          )
                        }
                      />
                    ),
                  },
                ]}
                pagination={false}
                bordered
              />
            </div>
            <Button
              onClick={addStrengthExercise}
              type="dashed"
              style={{ marginBottom: "20px", width: "100%" }}
            >
              Add Exercise
            </Button>
          </div>
        )}

        {workout === "cardio" && (
          <Form layout="vertical" style={{ marginTop: "20px" }}>
            <Form.Item label="Distance (miles)">
              <Input
                placeholder="Enter distance"
                value={cardioDetails.distance}
                onChange={(e) =>
                  setCardioDetails({
                    ...cardioDetails,
                    distance: e.target.value,
                  })
                }
              />
            </Form.Item>
            <Form.Item label="Duration (minutes)">
              <Input
                placeholder="Enter duration"
                value={cardioDetails.duration}
                onChange={(e) =>
                  setCardioDetails({
                    ...cardioDetails,
                    duration: e.target.value,
                  })
                }
              />
            </Form.Item>
            <Form.Item label="Pace (min/mile)">
              <Input
                placeholder="Enter pace"
                value={cardioDetails.pace}
                onChange={(e) =>
                  setCardioDetails({ ...cardioDetails, pace: e.target.value })
                }
              />
            </Form.Item>
          </Form>
        )}
        <div style={{ marginBottom: "20px" }}>
          <TextArea
            rows={4}
            placeholder="How was your workout?"
            value={content}
            onChange={(e) => setContent(e.currentTarget.value)}
            style={{ marginBottom: "10px" }}
          />
          <Input
            placeholder="Add location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{ marginBottom: "10px" }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button onClick={handleCancel} danger>
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={() => {
              const [workoutCategory, subcategory] = (
                selectedWorkout || ""
              ).split(".");
              const workoutType = workoutCategory.toUpperCase();

              let exercises: Exercise[] = [];

              if (workoutType === "STRENGTH") {
                exercises = strengthExercises.map((exercise) => ({
                  subcategory: exercise.exercise,
                  sets: parseInt(exercise.sets) || undefined,
                  reps: parseInt(exercise.reps) || undefined,
                  weight: parseFloat(exercise.weight) || undefined,
                }));
              } else if (workoutType === "CARDIO") {
                exercises = [
                  {
                    subcategory: subcategory,
                    distance: cardioDetails.distance
                      ? parseFloat(cardioDetails.distance)
                      : undefined,
                    duration: cardioDetails.duration
                      ? parseFloat(cardioDetails.duration)
                      : undefined,
                    pace: cardioDetails.pace
                      ? parseFloat(cardioDetails.pace)
                      : undefined,
                  },
                ];
              }

              createPost({ workoutType, content, location, exercises });
            }}
          >
            Post
          </Button>
        </div>
      </Modal>
    </div>
  );
}
