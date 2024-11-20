import {
  FireTwoTone,
  LineChartOutlined,
  MobileTwoTone,
  ProfileTwoTone,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { useState } from "react";
import { ConfigProvider } from "antd";
import "../styles/globals.css";

// Menu Items: Notifications, Profile, Analytics, Feed.

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    label: "Feed",
    key: "feed",
    icon: <MobileTwoTone twoToneColor="#85182a" />,
  },
  {
    label: "Notifications",
    key: "notifications",
    icon: <FireTwoTone twoToneColor={"#85182a"} />,
  },
  {
    label: "Analytics",
    key: "analytics",
    icon: <LineChartOutlined style={{ color: "#85182a" }} />,
  },
  {
    label: "Profile",
    key: "profile",
    icon: <ProfileTwoTone twoToneColor={"#85182a"} />,
  },
];
export default function () {
  const [current, setCurrent] = useState("feed");

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };

  return (
    <div className="navbar">
      <div className="navbar-menu">
        <ConfigProvider
          theme={{
            components: {
              Menu: {
                itemHoverColor: "#85182a", // Change hover color
              },
            },
          }}
        >
          <Menu
            onClick={onClick}
            selectedKeys={[current]}
            mode="horizontal"
            items={items}
          />
        </ConfigProvider>
      </div>
    </div>
  );
}
