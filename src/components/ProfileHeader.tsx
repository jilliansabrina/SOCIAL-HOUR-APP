import { Avatar, Button, List, Modal, Typography, Spin } from "antd";
import { useState, useEffect } from "react";
import {
  fetchUser,
  followUser,
  unfollowUser,
  fetchFollowing,
  fetchFollowers,
} from "@/shared/datasource";
import { useQuery, useMutation } from "react-query";
import { useRouter } from "next/router";

interface ProfileHeaderProps {
  username: string;
  loggedUser: string;
}

export default function ProfileHeader({
  username,
  loggedUser,
}: ProfileHeaderProps) {
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
  const [followers, setFollowers] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>([]);

  const router = useRouter();

  useEffect(() => {
    setIsFollowersModalOpen(false);
    setIsFollowingModalOpen(false);
  }, [username]);

  const {
    data: profileData,
    refetch,
    isLoading: isFetchingProfile,
  } = useQuery({
    queryKey: ["fetch-user", username],
    queryFn: () => fetchUser(username),
  });

  const { mutate: followUserMutation, isLoading: isFollowingLoading } =
    useMutation({
      mutationKey: ["follow-user", username],
      mutationFn: () => followUser(username),
      onSuccess: async () => {
        await refetch();
        await refreshFollowers();
      },
    });

  const { mutate: unfollowUserMutation, isLoading: isUnfollowingLoading } =
    useMutation({
      mutationKey: ["unfollow-user", username],
      mutationFn: () => unfollowUser(username),
      onSuccess: async () => {
        await refetch();
        await refreshFollowers();
      },
    });

  const refreshFollowers = async () => {
    try {
      const response = await fetchFollowers(username);
      setFollowers(response.data);
    } catch (error) {
      console.error("Error fetching followers:", error);
    }
  };

  const refreshFollowing = async () => {
    try {
      const response = await fetchFollowing(username);
      setFollowing(response.data);
    } catch (error) {
      console.error("Error fetching following:", error);
    }
  };

  const openFollowersModal = async () => {
    await refreshFollowers();
    setIsFollowersModalOpen(true);
  };

  const openFollowingModal = async () => {
    await refreshFollowing();
    setIsFollowingModalOpen(true);
  };

  const isLoading =
    isFetchingProfile || isFollowingLoading || isUnfollowingLoading;

  const isFollowing = Boolean(profileData?.followers.length ?? 0 > 0);

  return (
    <div
      style={{
        backgroundColor: "#f9f9f9",
        padding: "20px",
        borderRadius: "10px",
        textAlign: "center",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Avatar */}
      <Avatar
        size={80}
        style={{
          backgroundColor: "#85182a",
          color: "white",
          marginBottom: "10px",
        }}
      >
        {(username ?? " ")[0]?.toUpperCase()}
      </Avatar>

      {/* Username */}
      <Typography.Title level={3} style={{ marginBottom: "5px" }}>
        @{username}
      </Typography.Title>

      {isLoading ? (
        <Spin size="large" />
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginTop: "10px",
          }}
        >
          <Button type="link" onClick={openFollowersModal}>
            <Typography.Text strong>{followers.length || 0}</Typography.Text>{" "}
            Followers
          </Button>
          <Button type="link" onClick={openFollowingModal}>
            <Typography.Text strong>{following.length || 0}</Typography.Text>{" "}
            Following
          </Button>
        </div>
      )}

      {/* Follow/Unfollow Button */}
      <div style={{ marginTop: "10px" }}>
        {username === loggedUser ? (
          <Button
            style={{
              borderRadius: "20px",
              backgroundColor: "#85182a",
              color: "white",
            }}
          >
            Edit Profile
          </Button>
        ) : isFollowing ? (
          <Button
            style={{ borderRadius: "20px" }}
            onClick={() => unfollowUserMutation()}
            loading={isLoading}
          >
            Unfollow
          </Button>
        ) : (
          <Button
            style={{
              borderRadius: "20px",
              backgroundColor: "#85182a",
              color: "white",
            }}
            onClick={() => followUserMutation()}
            loading={isLoading}
          >
            Follow
          </Button>
        )}
      </div>

      {/* Modals */}
      <Modal
        title="Followers"
        open={isFollowersModalOpen}
        closable
        onCancel={() => setIsFollowersModalOpen(false)}
        footer={null}
      >
        {followers.length > 0 ? (
          <List
            dataSource={followers}
            renderItem={(follower) => (
              <List.Item key={follower}>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      style={{ backgroundColor: "#85182a", color: "white" }}
                    >
                      {follower[0]?.toUpperCase()}
                    </Avatar>
                  }
                  title={
                    <a
                      onClick={() => router.push(`/profile/${follower}`)}
                      style={{ cursor: "pointer", color: "#1890ff" }}
                    >
                      @{follower}
                    </a>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Spin size="large" />
        )}
      </Modal>

      <Modal
        title="Following"
        open={isFollowingModalOpen}
        closable
        onCancel={() => setIsFollowingModalOpen(false)}
        footer={null}
      >
        {following.length > 0 ? (
          <List
            dataSource={following}
            renderItem={(followedUser) => (
              <List.Item key={followedUser}>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      style={{ backgroundColor: "#85182a", color: "white" }}
                    >
                      {followedUser[0]?.toUpperCase()}
                    </Avatar>
                  }
                  title={
                    <a
                      onClick={() => router.push(`/profile/${followedUser}`)}
                      style={{ cursor: "pointer", color: "#1890ff" }}
                    >
                      @{followedUser}
                    </a>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Spin size="large" />
        )}
      </Modal>
    </div>
  );
}
