import React from "react";
import { Avatar, Typography, Tooltip } from "antd";
import { useRouter } from "next/router";

interface Author {
  username: string;
}

interface PostHeaderProps {
  author: Author;
  location?: string | null;
  date: any; // Replace with appropriate date type (e.g., Moment, Date)
  diff: number; // Difference in days for the post timestamp
}

const PostHeader: React.FC<PostHeaderProps> = ({
  author,
  location,
  date,
  diff,
}) => {
  const router = useRouter();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px",
        backgroundColor: "#f0f2f5",
        borderBottom: "1px solid #e8e8e8",
      }}
    >
      {/* Left Section: Avatar and Author Info */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <Avatar
          style={{
            backgroundColor: "#85182a",
            color: "white",
            marginRight: "10px",
          }}
        >
          {author.username[0]?.toUpperCase()}
        </Avatar>
        <div>
          <Typography.Text
            style={{
              fontWeight: "bold",
              cursor: "pointer",
              display: "block",
            }}
            onClick={() => router.push(`profile/${author.username}`)}
          >
            @{author.username}
          </Typography.Text>
          <Tooltip title={date.format("ddd MMM Do YYYY h:mm A")}>
            <Typography.Text type="secondary">
              {`Posted ${
                diff === 0
                  ? "today"
                  : diff === 1
                  ? "yesterday"
                  : `${diff} days ago`
              }`}
            </Typography.Text>
          </Tooltip>
        </div>
      </div>

      {/* Right Section: Location */}
      {location && (
        <div>
          <Typography.Text
            style={{
              color: "gray",
              marginRight: "5px",
            }}
          >
            📍 {location}
          </Typography.Text>
        </div>
      )}
    </div>
  );
};

export default PostHeader;
