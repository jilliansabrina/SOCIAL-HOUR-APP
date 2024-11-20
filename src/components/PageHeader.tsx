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
        {Boolean(userId) ? (
          <div
            style={{
              position: "absolute",
              right: 0,
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Avatar
              style={{ backgroundColor: "#85182a" }}
              icon={<UserOutlined />}
            />
            <Button
              variant="solid"
              style={{
                backgroundColor: "#85182a",
                color: "white",
                borderColor: "#85182a",
              }}
              onClick={() => {
                localStorage.removeItem("userId");
                router.push("/signin");
              }}
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <div
            style={{
              position: "absolute",
              right: 0,
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Button
              variant="solid"
              style={{
                backgroundColor: "#85182a",
                color: "white",
                borderColor: "#85182a",
              }}
              // onClick={signInPage}
            >
              Sign In
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
