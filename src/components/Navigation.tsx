import {
  FireTwoTone,
  LineChartOutlined,
  MobileTwoTone,
  ProfileTwoTone,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { AutoComplete, Input, Menu } from "antd";
import { useState } from "react";
import { ConfigProvider } from "antd";
import "../styles/globals.css";
import { useQuery } from "react-query";
import { fetchAllUsers } from "@/shared/datasource";
import Router, { useRouter } from "next/router";

type MenuItem = Required<MenuProps>["items"][number];

export default function () {
  const router = useRouter();
  const [current, setCurrent] = useState(router.route);
  const [options, setOptions] = useState<{ value: string; label?: string }[]>(
    []
  );
  const [value, setValue] = useState("");

  const onChange = (data: string) => {
    setValue(data);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["fetch-users"],
    queryFn: () => fetchAllUsers(),
  });

  const onSearch = (searchText: string) => {
    if (!searchText) {
      setOptions([]);
    } else if (data && data.data) {
      const filteredUsers = data.data.data
        .filter((user: any) =>
          user.username.toLowerCase().includes(searchText.toLowerCase())
        )
        .map((user: any) => ({
          value: user.username,
          label: `@${user.username}`,
        }));
      setOptions(filteredUsers);
    }
  };

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
    Router.push(`/${e.key}`);
  };

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

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px",
        backgroundColor: "white", // Optional: Make it look like a navbar
      }}
    >
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
          style={{ flexGrow: 1, flexShrink: 0 }}
        />
      </ConfigProvider>
      <AutoComplete
        options={options}
        style={{ width: 300 }}
        onSelect={onChange}
        onSearch={onSearch}
        placeholder="Search"
      >
        <Input.Search size="large" />
      </AutoComplete>
    </div>
  );
}
