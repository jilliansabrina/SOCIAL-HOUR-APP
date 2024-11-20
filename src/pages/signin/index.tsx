import PageHeader from "@/components/PageHeader";
import React from "react";
import { useState } from "react";
import { Divider, Button, Modal, Form, Input, DatePicker } from "antd";
import type { FormProps } from "antd";
import { Montserrat } from "next/font/google";
import "../../styles/globals.css";

// Import Montserrat
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500"], // Choose the weights you need for the header
});

type FieldType = {
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  birthdate?: Date;
};

const GoogleButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      className="gsi-material-button"
      onClick={onClick}
      style={{
        fontSize: "1.2em",
        padding: "10px 20px",
        marginBottom: "20px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div className="gsi-material-button-state"></div>
      <div
        className="gsi-material-button-content-wrapper"
        style={{ display: "flex", alignItems: "center", gap: "10px" }}
      >
        <div className="gsi-material-button-icon">
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            // xmlns:xlink="http://www.w3.org/1999/xlink"
            style={{ display: "block" }}
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            ></path>
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            ></path>
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            ></path>
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            ></path>
            <path fill="none" d="M0 0h48v48H0z"></path>
          </svg>
        </div>
        <span className="gsi-material-button-contents">
          Continue with Google
        </span>
      </div>
    </button>
  );
};

// const handleSignIn = async () => {
//   const { error } = await supabase.auth.signInWithOAuth({
//     provider: "google",
//     options: {
//       queryParams: {
//         access_type: "offline",
//         prompt: "consent",
//       },
//     },
//   });

//   if (error) {
//     console.error("Error signing in: ", error.message);
//   } else {
//     router.push("/feed");
//   }
// };

export default function () {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  //   const router = useRouter();
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      style={{ margin: "0 px", padding: "0 px", width: "100%", height: "100%" }}
    >
      <PageHeader />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          textAlign: "center",
        }}
      >
        <h2 className={`${montserrat.className}`}>Sweat. Share. Succeed.</h2>
        <GoogleButton
          onClick={() => {
            /* handle Google sign-in */
          }}
        />
        <Divider plain style={{ width: "80%" }}>
          or
        </Divider>
        <Button
          style={{
            width: "80%",
            fontSize: "1.1em",
            fontWeight: "bold",
            marginBottom: "20px",
            padding: "10px 0",
          }}
          shape="round"
          onClick={showModal}
        >
          Create account
        </Button>
        <Modal
          title="Create account"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          width={500}
          centered
        >
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Please input your username." },
              ]}
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
              rules={[
                { required: true, message: "Please input your password." },
              ]}
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
                    return Promise.reject(
                      new Error("The passwords do not match.")
                    );
                  },
                }),
              ]}
            >
              <Input.Password style={{ fontSize: "1em", padding: "8px" }} />
            </Form.Item>

            <Form.Item
              label="Date of birth"
              name="birthdate"
              rules={[
                { required: true, message: "Please enter your birthday." },
              ]}
            >
              <DatePicker style={{ width: "100%", fontSize: "1em" }} />
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
        <Button
          style={{
            width: "80%",
            fontSize: "1.1em",
            fontWeight: "bold",
            padding: "10px 0",
          }}
          shape="round"
        >
          Sign in
        </Button>
      </div>
    </div>
  );
}
