import React from "react";
import { Button, message } from "antd";
import CommentButton from "./CommentButton";
import LikeButton from "./LikeButton";
import { useMutation, useQueryClient } from "react-query";
import { deletePostMutation } from "@/shared/datasource";
import { useUsername } from "@/shared/hooks/useLocalStorage";

interface PostButtonsProps {
  postId: number;
  author: string;
  comments: any[]; // Adjust the type for comments if known
  refetchPost: () => void; // Function to refetch the post
}

const PostButtons: React.FC<PostButtonsProps> = ({
  postId,
  comments,
  author,
  refetchPost,
}) => {
  const queryClient = useQueryClient();
  const [loggedUsername] = useUsername();

  const { mutate: deletePost, isLoading } = useMutation(
    () => deletePostMutation(postId),
    {
      onSuccess: () => {
        // Invalidate and refetch posts after deletion
        queryClient.invalidateQueries("fetch-user");
        queryClient.invalidateQueries("fetch-posts");
        message.success("Post deleted successfully!");
      },
      onError: () => {
        message.error("Failed to delete the post. Please try again.");
      },
    }
  );

  const handleDelete = () => {
    deletePost();
  };

  return (
    <>
      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "15px",
          borderTop: "1px solid #e8e8e8",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <CommentButton
            comments={comments}
            postId={postId}
            refetchPost={refetchPost}
          />
          <LikeButton postId={postId} />
        </div>
      </div>

      {/* Delete Button */}
      {loggedUsername === author && (
        <div
          style={{
            textAlign: "right",
            padding: "10px 15px",
            borderTop: "1px solid #e8e8e8",
          }}
        >
          <Button
            onClick={handleDelete}
            style={{
              color: "#85182a",
              backgroundColor: "white",
              borderColor: "#85182a",
            }}
          >
            Delete
          </Button>
        </div>
      )}
    </>
  );
};

export default PostButtons;
