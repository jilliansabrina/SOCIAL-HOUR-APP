import { useUsername } from "@/shared/hooks/useLocalStorage";
import { FeedCommentRecord } from "@/types/feed";
import { DeleteOutlined, MessageTwoTone } from "@ant-design/icons";
import {
  Spin,
  Tooltip,
  Avatar,
  Button,
  Input,
  List,
  Modal,
  Typography,
} from "antd";
import { useRouter } from "next/router";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import {
  addCommentMutation,
  fetchComments,
  fetchUser,
  deleteCommentMutation,
} from "@/shared/datasource";
import dayjs from "dayjs";

type CommentButtonProps = {
  postId: number;
};

export default function CommentButton({ postId }: CommentButtonProps) {
  const [loggedUsername] = useUsername();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [text, setText] = useState("");

  const router = useRouter();

  const { data: profileData } = useQuery({
    queryKey: ["fetch-user", loggedUsername],
    queryFn: () => fetchUser(loggedUsername as string),
  });

  const { data: fetchedComments = [], refetch: refetchComments } = useQuery({
    queryKey: ["fetch-comments", postId],
    queryFn: () => fetchComments(postId),
  });

  const { mutate: addComment, isLoading: isCommenting } = useMutation({
    mutationKey: "addComment",
    mutationFn: async (data: { postId: number; content: string }) => {
      if (!profileData?.id) {
        throw new Error("Profile data not loaded. Cannot add comment.");
      }
      return await addCommentMutation(
        data.postId,
        profileData.id,
        data.content
      );
    },
    onSuccess: () => {
      refetchComments(); // Refresh comments after adding
      setText(""); // Clear input
    },
  });

  const { mutate: deleteComment, isLoading: isDeleting } = useMutation({
    mutationFn: async (data: { commentId: number }) => {
      return await deleteCommentMutation(data.commentId);
    },
    onSuccess: () => refetchComments(),
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const onCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      {/* Comment Button */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          color: "#85182a",
        }}
        onClick={showModal}
      >
        <MessageTwoTone twoToneColor={"#85182a"} style={{ fontSize: "24px" }} />
        <Typography.Text style={{ marginLeft: "8px" }}>
          {fetchedComments.length} comments
        </Typography.Text>
      </div>

      {/* Comments Modal */}
      <Modal
        title={<Typography.Text strong>Comments</Typography.Text>}
        footer={null}
        closable={true}
        open={isModalOpen}
        onCancel={onCancel}
        style={{
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {/* Comments List */}
        <List
          itemLayout="horizontal"
          dataSource={fetchedComments}
          renderItem={(comment: FeedCommentRecord) => (
            <List.Item
              key={comment.id}
              style={{
                borderBottom: "1px solid #f0f0f0",
                paddingBottom: "10px",
                marginBottom: "10px",
              }}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    style={{
                      backgroundColor: "#85182a",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    {comment.author?.username
                      ? comment.author.username[0]?.toUpperCase()
                      : "?"}
                  </Avatar>
                }
                title={
                  comment.author ? (
                    <Typography.Text
                      style={{
                        cursor: "pointer",
                        fontWeight: "bold",
                        color: "black",
                      }}
                      onClick={() =>
                        router.push(`/profile/${comment.author.username}`)
                      }
                    >
                      @{comment.author.username}
                    </Typography.Text>
                  ) : (
                    <Typography.Text type="secondary">
                      Unknown User
                    </Typography.Text>
                  )
                }
                description={
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <Tooltip
                      title={dayjs(comment.timestamp).format(
                        "ddd MMM Do YYYY h:mm A"
                      )}
                    >
                      <Typography.Text
                        style={{
                          display: "block",
                          fontSize: "12px",
                          color: "gray",
                          marginBottom: "5px",
                        }}
                      >
                        {dayjs().diff(dayjs(comment.timestamp), "days") === 0
                          ? "Today"
                          : `${dayjs().diff(
                              dayjs(comment.timestamp),
                              "days"
                            )} days ago`}
                      </Typography.Text>
                    </Tooltip>
                    <div
                      style={{
                        padding: "10px",
                        backgroundColor: "#f6f8fa",
                        borderRadius: "10px",
                        border: "1px solid #e8e8e8",
                        fontStyle: "italic",
                      }}
                    >
                      <Typography.Text>{comment.content}</Typography.Text>
                    </div>
                  </div>
                }
              />
              {loggedUsername === comment.author?.username && (
                <div
                  style={{
                    marginTop: "10px",
                    textAlign: "right",
                  }}
                >
                  <Button
                    danger
                    size="small"
                    onClick={() => deleteComment({ commentId: comment.id })}
                    style={{
                      backgroundColor: "#85182a",
                      borderColor: "#85182a",
                      color: "white",
                      borderRadius: "5px",
                    }}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </List.Item>
          )}
        />

        {/* Add Comment Section */}
        <div style={{ marginTop: "20px" }}>
          <Input.TextArea
            placeholder="Add a comment..."
            value={text}
            onChange={(e) => setText(e.currentTarget.value)}
            autoSize={{ minRows: 2, maxRows: 4 }}
            style={{
              borderRadius: "8px",
              marginBottom: "10px",
            }}
          />
          <Button
            type="primary"
            block
            onClick={() => addComment({ postId, content: text })}
            loading={isCommenting}
            style={{
              backgroundColor: "#85182a",
              borderColor: "#85182a",
              borderRadius: "8px",
            }}
          >
            Post Comment
          </Button>
        </div>
      </Modal>
    </div>
  );
}
