import { PlusOutlined } from "@ant-design/icons";
import { Button, Modal, TreeSelect, Input, Form, Table } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { createPostMutation } from "@/shared/datasource";
import { useUsername } from "@/shared/hooks/useLocalStorage";

type Exercise = {
  name: string;
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
      {
        value: "cardio.running",
        title: "Running",
      },
      {
        value: "cardio.walking",
        title: "Walking",
      },
      {
        value: "cardio.stairmaster",
        title: "Stairmaster",
      },
      {
        value: "cardio.cycling",
        title: "Cycling",
      },
    ],
  },
  {
    value: "strength",
    title: "Strength Training",
    children: [
      {
        value: "strength.bodybuilding",
        title: "Bodybuilding",
      },
      {
        value: "strength.circuit",
        title: "Circuit",
      },
      {
        value: "strength.powerlifting",
        title: "Powerlifting",
      },
    ],
  },
  {
    value: "flexibility",
    title: "Flexibility",
    children: [
      {
        value: "flexibility.yoga",
        title: "Yoga",
      },
      {
        value: "flexibility.pilates",
        title: "Pilates",
      },
      {
        value: "flexibility.stretching",
        title: "Stretching",
      },
    ],
  },
  {
    value: "other",
    title: "Other",
    children: [
      {
        value: "other.dancing",
        title: "Dancing",
      },
      {
        value: "other.swimming",
        title: "Swimming",
      },
    ],
  },
];

const workoutTypeMap = {
  cardio: ["running", "walking", "cycling"],
  strength: ["bodybuilding", "powerlifting", "circuit"],
};

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
        data.content,
        data.location || "",
        data.workoutType
      );
    },
    onSuccess: () => {
      refetch();
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState("");
  const [workout, setWorkout] = useState("");
  const [selectedWorkout, setSelectedWorkout] = useState<string | undefined>(
    undefined
  );
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [strengthExercises, setStrengthExercises] = useState<
    StrengthExercise[]
  >([]);
  const [cardioDetails, setCardioDetails] = useState({
    distance: "",
    duration: "",
    pace: "",
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (data?.data) {
      setContent("");
      setLocation("");
      setIsModalOpen(false);
    }
  }, [data]);

  const [username] = useUsername();

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
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: value, // Safely update the specific field
    };
    setStrengthExercises(updatedExercises);
  };

  return (
    <div>
      <Button
        style={{
          backgroundColor: "#85182a",
        }}
        shape="round"
        icon={<PlusOutlined style={{ color: "white" }} />}
        onClick={showModal}
      />
      <Modal
        title={"Share Your Progress"}
        open={isModalOpen}
        footer={null}
        closable={false}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          margin: "30px 15px 15px 15 px",
        }}
      >
        <div style={{ color: "black", marginBottom: "10px" }}>
          <TreeSelect
            showSearch
            style={{ width: "100%" }}
            value={selectedWorkout}
            dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
            placeholder="Select workout type"
            allowClear
            treeDefaultExpandAll
            onChange={(value) => {
              setSelectedWorkout(value); // Display full selected value
              // Map value to parent category for rendering
              const parentWorkout =
                workoutData.find((category) =>
                  category.children?.some((child) => child.value === value)
                )?.value || value;
              setWorkout(parentWorkout); // Derive parent for rendering logic
            }}
            treeData={workoutData}
            treeNodeFilterProp="title"
          />
        </div>
        {workout === "strength" && (
          <div style={{ margin: "10px" }}>
            <Table
              dataSource={strengthExercises}
              columns={[
                {
                  title: "Exercise",
                  dataIndex: "exercise",
                  render: (_, record, index) => (
                    <Input
                      placeholder="Exercise"
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
                      onChange={(e) =>
                        updateStrengthExercise(index, "reps", e.target.value)
                      }
                    />
                  ),
                },
                {
                  title: "Weight (lb)",
                  dataIndex: "weight",
                  render: (_, record, index) => (
                    <Input
                      placeholder="Weight"
                      onChange={(e) =>
                        updateStrengthExercise(index, "weight", e.target.value)
                      }
                    />
                  ),
                },
              ]}
              pagination={false}
            />
            <Button
              onClick={addStrengthExercise}
              type="dashed"
              style={{ marginTop: "10px" }}
            >
              Add Exercise
            </Button>
          </div>
        )}

        {workout === "cardio" && (
          <Form layout="vertical">
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
        <TextArea
          rows={4}
          placeholder="How was your workout?"
          style={{
            width: 300,
            margin: "10px",
          }}
          value={content}
          onChange={(e) => setContent(e.currentTarget.value)}
        />
        <div>
          <Input
            placeholder={"Add location"}
            value={location}
            onChange={(e) => setLocation(e.currentTarget.value)}
          />
          <Button>Upload Photo</Button>
        </div>
        <div>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button
            onClick={() => {
              const workoutType = workout; // e.g., "strength", "cardio", etc.
              const locationValue = location || ""; // Default to an empty string if undefined
              let exercises: Exercise[] = []; // Explicitly type `exercises` as an array of `Exercise`

              if (workoutType === "strength") {
                exercises = strengthExercises.map((exercise) => ({
                  name: exercise.exercise,
                  sets: parseInt(exercise.sets, 10) || undefined,
                  reps: parseInt(exercise.reps, 10) || undefined,
                  weight: parseFloat(exercise.weight) || undefined,
                }));
              } else if (workoutType === "cardio") {
                exercises = [
                  {
                    name: selectedWorkout?.split(".")[1] || "Cardio",
                    distance: parseFloat(cardioDetails.distance) || undefined,
                    duration: parseFloat(cardioDetails.duration) || undefined,
                    pace: parseFloat(cardioDetails.pace) || undefined,
                  },
                ];
              } else if (workoutType === "other") {
                exercises = [
                  {
                    name: selectedWorkout?.split(".")[1] || "Other",
                  },
                ];
              }

              createPost({
                content,
                location: locationValue,
                workoutType,
                exercises, // Now TypeScript knows `exercises` is of type `Exercise[]`
              });
            }}
          >
            Post
          </Button>
        </div>
      </Modal>
    </div>
  );
}
