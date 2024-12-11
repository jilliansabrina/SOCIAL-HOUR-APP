import { fetchSignIn } from "@/shared/datasource";
import { useUsername } from "@/shared/hooks/useLocalStorage";
import { Button, Form, Input, Modal, Typography } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMutation } from "react-query";
import { Montserrat } from "next/font/google";

// Import Montserrat font
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500"], // Adjust weight for the title
});

type FieldType = {
  username: string;
  password: string;
};

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
};

export default function SignInForm({ isModalOpen, setIsModalOpen }: Props) {
  const {
    mutate: signIn,
    error,
    data,
  } = useMutation({
    mutationKey: "signIn",
    mutationFn: async (data: FieldType) => {
      return await fetchSignIn(data.username, data.password);
    },
  });

  const [username, setUsername] = useUsername();

  const router = useRouter();

  useEffect(() => {
    if (data) {
      setIsModalOpen(false);
      if (typeof setUsername === "function" && data?.data?.user?.username) {
        setUsername(data.data.user.username);
      }
      router.push("/feed");
    }
  }, [data]);

  return (
    <Modal
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      width={500}
      footer={null}
      centered
    >
      <Form
        name="basic"
        style={{
          maxWidth: 400,
          margin: "0 auto",
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        }}
        initialValues={{ remember: true }}
        onFinish={(val) => {
          signIn({
            username: val.username,
            password: val.password,
          });
        }}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item<FieldType>
          label={
            <Typography.Text
              style={{ fontWeight: 600 }}
              className={`${montserrat.className}`}
            >
              Username
            </Typography.Text>
          }
          name="username"
          rules={[{ required: true, message: "Please input your username." }]}
        >
          <Input
            className={`${montserrat.className}`}
            style={{
              fontSize: "1em",
              padding: "10px",
              borderRadius: "5px",
            }}
          />
        </Form.Item>

        <Form.Item<FieldType>
          label={
            <Typography.Text
              style={{ fontWeight: 600 }}
              className={`${montserrat.className}`}
            >
              Password
            </Typography.Text>
          }
          name="password"
          rules={[{ required: true, message: "Please input your password." }]}
        >
          <Input.Password
            style={{
              fontSize: "1em",
              padding: "10px",
              borderRadius: "5px",
            }}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            className={`${montserrat.className}`}
            style={{
              backgroundColor: "#85182a",
              borderColor: "#85182a",
              color: "white",
              fontSize: "1.1em",
              fontWeight: "bold",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            SIGN IN
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
