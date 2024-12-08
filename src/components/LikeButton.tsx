import {
  fetchLikes,
  fetchUser,
  likePost,
  unlikePost,
} from "@/shared/datasource";
import { useUsername } from "@/shared/hooks/useLocalStorage";
import { HeartTwoTone } from "@ant-design/icons";
import { Avatar, List, Modal, Spin } from "antd";
import { useRouter } from "next/router";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";

type LikeButtonProps = {
  postId: number;
};

export default function ({ postId }: LikeButtonProps) {
  const [loggedUsername] = useUsername();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: profileData, isLoading } = useQuery({
    queryKey: ["fetch-user", loggedUsername],
    queryFn: () => fetchUser(loggedUsername as string),
  });

  const router = useRouter();

  const { data: likes = [], refetch } = useQuery({
    queryKey: ["fetch-likes", postId],
    queryFn: async () => {
      const result = await fetchLikes(postId);
      return result?.usernames || [];
    },
  });
  const { mutate: handleLike, isLoading: isLiking } = useMutation({
    mutationFn: () => {
      if (!profileData?.id) {
        throw new Error("Profile data not loaded. Cannot like post.");
      }
      return likePost(postId, profileData.id);
    },
    onSuccess: () => refetch(),
  });

  const { mutate: handleUnlike, isLoading: isUnliking } = useMutation({
    mutationFn: () => {
      if (!profileData?.id) {
        throw new Error("Profile data not loaded. Cannot unlike post.");
      }
      return unlikePost(postId, profileData.id);
    },
    onSuccess: () => refetch(),
  });

  const showModal = () => {
    setIsModalOpen(true);
  };
  const onCancel = () => {
    setIsModalOpen(false);
  };
  const isLikedByUser = likes?.includes(loggedUsername);

  const toggleLike = () => {
    if (isLoading || isLiking || isUnliking) {
      return; // Prevent toggle while loading or mutation is in progress
    }

    if (isLikedByUser) {
      handleUnlike();
    } else {
      handleLike();
    }
  };

  return (
    <div>
      <HeartTwoTone
        twoToneColor={isLikedByUser ? "#85182a" : "#fff0f3"}
        style={{ fontSize: "24px", cursor: "pointer" }}
        onClick={toggleLike} // Toggle like/unlike on click
      />
      <span style={{ marginLeft: "8px" }} onClick={showModal}>
        {likes === null ? <Spin size="small" /> : likes?.length} likes
      </span>
      <Modal
        title="Liked by"
        open={isModalOpen}
        onCancel={onCancel}
        footer={null}
      >
        <List
          itemLayout="horizontal"
          dataSource={likes}
          renderItem={(likedBy: string) => {
            return (
              <List.Item key={likedBy}>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      style={{ backgroundColor: "#85182a", color: "white" }}
                    >
                      {likedBy[0]?.toUpperCase()}
                    </Avatar>
                  }
                  title={
                    <a
                      onClick={() => router.push(`/profile/${likedBy}`)}
                      style={{ cursor: "pointer", color: "black" }}
                    >
                      @{likedBy}
                    </a>
                  }
                />
              </List.Item>
            );
          }}
        />
      </Modal>
    </div>
  );
}
