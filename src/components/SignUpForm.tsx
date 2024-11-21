import { fetchCreateUser } from "@/shared/datasource";
import { Button, Form, FormProps, Input, Modal } from "antd";
import { useRouter } from "next/router";
import { useMutation } from "react-query";

type FieldType = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
};

export default function SignUpForm({ isModalOpen, setIsModalOpen }: Props) {
  const { mutate: createUser } = useMutation({
    mutationKey: "createUser",
    mutationFn: async (data: FieldType) => {
      return await fetchCreateUser(data.email, data.username, data.password);
    },
  });

  const router = useRouter();
  return (
    <Modal
      title="Create account"
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
          createUser({
            email: val.email,
            username: val.username,
            password: val.password,
            confirmPassword: val.confirmPassword,
          });
          setIsModalOpen(false);
          router.push("/feed");
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
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email." }]}
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

        <Form.Item
          label="Confirm password"
          name="confirmPassword"
          rules={[
            { required: true, message: "Please confirm your password." },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("The passwords do not match."));
              },
            }),
          ]}
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
