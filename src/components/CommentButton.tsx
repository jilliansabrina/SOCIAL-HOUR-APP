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
  fetchUser,
  deleteCommentMutation,
} from "@/shared/datasource";
import dayjs from "dayjs";

type CommentButtonProps = {
  comments: FeedCommentRecord[];
  postId: number;
  refetchPost: () => void;
};

export default function CommentButton({
  comments,
  postId,
  refetchPost,
}: CommentButtonProps) {
  const [loggedUsername] = useUsername();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [text, setText] = useState("");

  const router = useRouter();

  const { data: profileData } = useQuery({
    queryKey: ["fetch-user", loggedUsername],
    queryFn: () => fetchUser(loggedUsername as string),
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
      refetchPost();
      setText(""); // Clear input on success
    },
  });

  const { mutate: deleteComment, isLoading: isDeleting } = useMutation({
    mutationFn: async (data: { commentId: number }) => {
      return await deleteCommentMutation(data.commentId);
    },
    onSuccess: () => refetchPost(),
  });

  const showModal = () => {
    setIsModalOpen(true);
    console.log(comments);
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
          {comments === null ? <Spin size="small" /> : comments?.length}{" "}
          comments
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
          dataSource={comments}
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
                      ? comment.author?.username?.[0]?.toUpperCase()
                      : "?"}
                  </Avatar>
                }
                title={
                  comment.author?.username ? (
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
                    {/* Timestamp as a subtitle */}
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

                    {/* Comment Content and Delete Button */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        gap: "10px",
                      }}
                    >
                      {/* Comment Content */}
                      <div
                        style={{
                          padding: "10px",
                          backgroundColor: "#f6f8fa",
                          borderRadius: "10px",
                          border: "1px solid #e8e8e8",
                          fontStyle: "italic",
                          flexGrow: 1,
                        }}
                      >
                        <Typography.Text>{comment.content}</Typography.Text>
                      </div>

                      {/* Delete Button */}
                      {loggedUsername === comment.author?.username && (
                        <DeleteOutlined
                          onClick={() =>
                            deleteComment({ commentId: comment.id })
                          }
                          style={{
                            color: "#85182a",
                            fontSize: "16px",
                            cursor: "pointer",
                            position: "relative",
                          }}
                        />
                      )}
                    </div>
                  </div>
                }
              />
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
