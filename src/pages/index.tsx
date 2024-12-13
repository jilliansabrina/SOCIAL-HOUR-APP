import React from "react";
import { Button } from "antd";
import { Montserrat } from "next/font/google";

// Import Montserrat font
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700"], // Normal and bold weights
});

export default function LandingPage() {
  return (
    <div
      style={{
        minHeight: "100vh", // Full viewport height
        backgroundColor: "#000", // Black background
        display: "flex",
        justifyContent: "center", // Center horizontally
        alignItems: "center", // Center vertically
        flexDirection: "column", // Stack items vertically
        fontFamily: montserrat.style.fontFamily, // Apply Montserrat font
        color: "#f4decd", // Warm beige text to match the theme
        textAlign: "center",
      }}
    >
      <div
        style={{
          transform: "translateY(-30px)", // Adjust content slightly upward
        }}
      >
        <h1
          style={{
            fontSize: "3rem", // Large heading
            fontWeight: 700, // Bold text
            marginBottom: "1rem",
          }}
        >
          Lost? Join Your New Family.
        </h1>
        <p
          style={{
            fontSize: "1.2rem", // Smaller subheading
            fontWeight: 400, // Normal text
            marginBottom: "2rem",
          }}
        >
          Discover a supportive community and start your journey today.
        </p>
        <Button
          type="primary"
          style={{
            backgroundColor: "#85182a", // Signature red
            borderColor: "#85182a",
            color: "#fff",
            padding: "10px 25px",
            fontSize: "1.2rem",
            borderRadius: "30px",
            fontWeight: 700,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)", // Slight shadow for depth
            transition: "all 0.3s ease",
          }}
          onClick={() => {
            window.location.href = "/signin"; // Redirect to sign-in page
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#a71d33")
          } // Darker hover effect
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#85182a")
          }
        >
          Proceed to Sign In
        </Button>
      </div>
    </div>
  );
}
