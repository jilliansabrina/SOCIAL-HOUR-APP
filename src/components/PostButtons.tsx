import React, { useState } from "react";
import { Button, message, Modal } from "antd";
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
  const [isModalVisible, setIsModalVisible] = useState(false);

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
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    deletePost(); // Trigger post deletion
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Close the modal without deleting
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
            onClick={showModal}
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
      <Modal
        title="Confirm Delete"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={isLoading} // Show loading spinner on the OK button
        okText="Delete"
        okButtonProps={{ style: { backgroundColor: "#85182a" } }}
        cancelText="Cancel"
      >
        <p>
          Are you sure you want to delete this post? This action cannot be
          undone.
        </p>
      </Modal>
    </>
  );
};

export default PostButtons;
