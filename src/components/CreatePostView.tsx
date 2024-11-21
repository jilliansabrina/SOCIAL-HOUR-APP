import { PlusOutlined } from "@ant-design/icons";
import { Button, Modal, Select, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { createPostMutation } from "@/shared/datasource";
import { useUsername } from "@/shared/hooks/useLocalStorage";

type FormValues = {
  content: string;
  workoutDuration?: number;
  location?: string;
};

export default function () {
  const {
    mutate: createPost,
    error,
    data,
  } = useMutation({
    mutationKey: "createPostMutation",
    mutationFn: async (data: FormValues) => {
      return await createPostMutation(
        data.content,
        data.location,
        data.workoutDuration
      );
    },
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState("");
  const [workoutType, setWorkoutType] = useState("");
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [location, setLocation] = useState("");

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
          <Select
            style={{ width: 300, textAlign: "left" }}
            placeholder={"Select workout type"}
            options={[
              { value: "weightlifting", label: "Weighlifting" },
              { value: "walking", label: "Walking" },
              { value: "running", label: "Running" },
              { value: "swimming", label: "Swimming" },
              { value: "stairmaster", label: "Stairmaster" },
              { value: "cycling", label: "Cycling" },
              { value: "circuit", label: "Circuit" },
              { value: "pilates", label: "Pilates" },
              { value: "yoga", label: "Yoga" },
              { value: "dancing", label: "Dancing" },
              { value: "stretching", label: "Stretching" },
            ]}
            onChange={(e) => setWorkoutType(e.value)}
          />
        </div>
        <TextArea
          rows={4}
          placeholder="How was your workout?"
          style={{
            width: 300,
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
              createPost({ content, location, workoutDuration: 20 });
            }}
          >
            Post
          </Button>
        </div>
      </Modal>
    </div>
  );
}
