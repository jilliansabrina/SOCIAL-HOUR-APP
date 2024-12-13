import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Layout } from "antd";
import { Montserrat } from "next/font/google";
import { useRouter } from "next/router";
import { useLocalForage } from "@zikwall/use-localforage";

// Import Montserrat
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300"], // Choose the weights you need for the header
});

export default function () {
  const router = useRouter();
  const [userId, setUserId] = useLocalForage<number | null>("userId", null);
  return (
    <div
      className={`${montserrat.className}`}
      style={{
        backgroundColor: "black",
        fontSize: "35px",
        letterSpacing: "3px",
        padding: "10px 30px",
        margin: "0",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          position: "relative",
          backgroundColor: "black",
        }}
      >
        <h2 className="header-title" style={{ color: "white" }}>
          SOCIAL HOUR
        </h2>
      </div>
    </div>
  );
}
