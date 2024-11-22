import { useUsername } from "@/shared/hooks/useLocalStorage";
import { FeedCommentRecord, FeedPostRecord } from "@/types/feed";
import { FundViewOutlined, MessageTwoTone } from "@ant-design/icons";
import { Avatar, Button, Input, List, Modal } from "antd";
import { useRouter } from "next/router";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import {
  addCommentMutation,
  fetchUser,
  deleteCommentMutation,
} from "@/shared/datasource";

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

  const {
    mutate: addComment,
    error,
    isLoading: isCommenting,
  } = useMutation({
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
    onSuccess: () => refetchPost(),
  });

  // Delete comment mutation
  const { mutate: deleteComment, isLoading: isDeleting } = useMutation({
    mutationFn: async (data: { commentId: number }) => {
      return await deleteCommentMutation(data.commentId);
    },
    onSuccess: () => refetchPost(),
  });

  const handleComment = () => {
    addComment({ postId, content: text });
    setText("");
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const onCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <MessageTwoTone
        twoToneColor={"#85182a"}
        style={{ fontSize: "24px", cursor: "pointer" }}
        onClick={showModal}
      />
      <Modal
        title={"Comments"}
        footer={null}
        closable={true}
        open={isModalOpen}
        onCancel={onCancel}
      >
        <List
          itemLayout="horizontal"
          dataSource={comments}
          renderItem={(comment: FeedCommentRecord) => {
            return (
              <List.Item key={comment.author.id}>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      style={{ backgroundColor: "#85182a", color: "white" }}
                    >
                      {comment.author.username[0]?.toUpperCase()}
                    </Avatar>
                  }
                  title={
                    <a
                      onClick={() =>
                        router.push(`/profile/${comment.author.username}`)
                      }
                      style={{ cursor: "pointer", color: "#1890ff" }}
                    >
                      @{comment.author.username}
                    </a>
                  }
                  description={comment.content}
                />
              </List.Item>
            );
          }}
        />
        <Input
          placeholder="Add comment"
          value={text}
          onChange={(e) => {
            setText(e.currentTarget.value);
          }}
        />
        <Button
          onClick={() => {
            handleComment();
          }}
        >
          Post Comment
        </Button>
      </Modal>
    </div>
  );
}
