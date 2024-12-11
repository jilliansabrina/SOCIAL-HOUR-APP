import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";

type Props = {
  onClick: () => void;
};

export default function CreatePostButton({ onClick }: Props) {
  return (
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
      onClick={onClick}
    >
      Create Post
    </Button>
  );
}
