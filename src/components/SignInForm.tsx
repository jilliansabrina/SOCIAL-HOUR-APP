import { fetchSignIn } from "@/shared/datasource";
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
    onSuccess: (data) => {
      console.log("Signed successfully:", data);
    },
    onError: (error: any) => {
      console.error("Error signing in:", error.message);
    },
  });

  useEffect(() => {
    if (data) {
      console.log(data);
      setIsModalOpen(false);
      localStorage.setItem("userId", data.data.user.id.toString());
      router.push("/feed");
    }
  }, [data]);

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

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
          console.log(val);
          signIn({
            username: val.username,
            password: val.password,
          });
        }}
        onFinishFailed={onFinishFailed}
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
        {error && <div style={{ color: "red" }}>R u stooped</div>}
      </Form>
    </Modal>
  );
}
