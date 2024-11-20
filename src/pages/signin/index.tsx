import React from "react";
import { useState } from "react";
import { Button } from "antd";
import { Montserrat } from "next/font/google";
import "../../styles/globals.css";
import SignUpForm from "@/components/SignUpForm";
import SignInForm from "@/components/SignInForm";

// Import Montserrat
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500"], // Choose the weights you need for the header
});

export default function () {
  const [isAccountCreateModalOpen, setIsAccountCreateModalOpen] =
    useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  return (
    <div>
      <SignUpForm
        isModalOpen={isAccountCreateModalOpen}
        setIsModalOpen={setIsAccountCreateModalOpen}
      />
      <SignInForm
        isModalOpen={isSignInModalOpen}
        setIsModalOpen={setIsSignInModalOpen}
      />
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
        <Button
          style={{
            width: "80%",
            fontSize: "1.1em",
            fontWeight: "bold",
            marginBottom: "20px",
            padding: "10px 0",
          }}
          shape="round"
          onClick={() => setIsAccountCreateModalOpen(true)}
        >
          Create account
        </Button>

        <Button
          style={{
            width: "80%",
            fontSize: "1.1em",
            fontWeight: "bold",
            padding: "10px 0",
          }}
          shape="round"
          onClick={() => {
            setIsSignInModalOpen(true);
          }}
        >
          Sign in
        </Button>
      </div>
    </div>
  );
}
