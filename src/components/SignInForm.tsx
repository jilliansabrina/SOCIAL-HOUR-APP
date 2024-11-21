import { fetchSignIn } from "@/shared/datasource";
import { useUsername } from "@/shared/hooks/useLocalStorage";
import { Button, Form, FormProps, Input, Modal } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMutation } from "react-query";

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

  useEffect(() => {
    if (data) {
      setIsModalOpen(false);
      setUsername(data.data.user.username);
      router.push("/feed");
    }
  }, [data]);

  const router = useRouter();
  return (
    <Modal
      title="Sign In"
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      width={500}
      footer={null}
      centered
    >
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
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
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username." }]}
        >
          <Input style={{ fontSize: "1em", padding: "8px" }} />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password." }]}
        >
          <Input.Password style={{ fontSize: "1em", padding: "8px" }} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ fontSize: "1.1em", padding: "8px 16px" }}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
