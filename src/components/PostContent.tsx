import React from "react";
import { Typography } from "antd";

interface PostContentProps {
  content?: string | null; // Content can be optional or null
}

const PostContent: React.FC<PostContentProps> = ({ content }) => {
  if (!content) return null; // Return nothing if content is null or undefined

  return (
    <div
      style={{
        padding: "15px",
        backgroundColor: "#f6f8fa",
        margin: "15px",
        borderRadius: "10px",
        border: "1px solid #e8e8e8",
      }}
    >
      <Typography.Text style={{ fontStyle: "italic" }}>
        {content}
      </Typography.Text>
    </div>
  );
};

export default PostContent;
