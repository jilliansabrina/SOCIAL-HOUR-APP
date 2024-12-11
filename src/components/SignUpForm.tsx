import { fetchCreateUser } from "@/shared/datasource";
import { Button, Form, Input, Modal, Typography } from "antd";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { Montserrat } from "next/font/google";

// Import Montserrat font
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500"],
});

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
          label={
            <Typography.Text
              style={{ fontWeight: 600 }}
              className={montserrat.className}
            >
              Username
            </Typography.Text>
          }
          name="username"
          rules={[{ required: true, message: "Please input your username." }]}
        >
          <Input
            className={montserrat.className}
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
              className={montserrat.className}
            >
              Email
            </Typography.Text>
          }
          name="email"
          rules={[{ required: true, message: "Please input your email." }]}
        >
          <Input
            className={montserrat.className}
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
              className={montserrat.className}
            >
              Password
            </Typography.Text>
          }
          name="password"
          rules={[{ required: true, message: "Please input your password." }]}
        >
          <Input.Password
            className={montserrat.className}
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
              className={montserrat.className}
            >
              Confirm Password
            </Typography.Text>
          }
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
          <Input.Password
            className={montserrat.className}
            style={{
              fontSize: "1em",
              padding: "10px",
              borderRadius: "5px",
            }}
          />
        </Form.Item>

        <Form.Item>
          <Button
            className={montserrat.className}
            type="primary"
            htmlType="submit"
            block
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
            CREATE ACCOUNT
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
