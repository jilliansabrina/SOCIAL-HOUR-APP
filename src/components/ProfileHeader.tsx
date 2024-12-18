import {
  Avatar,
  Button,
  List,
  Modal,
  Typography,
  Spin,
  message,
  Input,
} from "antd";
import { useState, useEffect } from "react";
import {
  fetchUser,
  followUser,
  unfollowUser,
  fetchFollowing,
  fetchFollowers,
  updateUsername,
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
  const [isChangeUsernameOpen, setIsChangeUsernameOpen] = useState(false); // New modal state
  const [newUsername, setNewUsername] = useState("");

  const router = useRouter();

  const handleSignOut = () => {
    window.localStorage.removeItem("username");
    router.push("/signin");
  };

  useEffect(() => {
    setIsFollowersModalOpen(false);
    setIsFollowingModalOpen(false);
    setIsChangeUsernameOpen(false);
  }, [username]);

  const {
    data: profileData,
    refetch,
    isLoading: isFetchingProfile,
  } = useQuery({
    queryKey: ["fetch-user", username],
    queryFn: () => fetchUser(username),
    onSuccess: async () => {
      await refreshFollowers();
      await refreshFollowing();
    },
  });

  useEffect(() => {
    if (profileData?.followers) {
      setFollowers(profileData.followers.map((follower) => follower.username));
    }
  }, [profileData?.followers]);

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

  const { mutate: updateUsernameMutation, isLoading: isUpdatingUsername } =
    useMutation(
      (newUsername: string) => updateUsername(username, newUsername), // API call
      {
        onSuccess: async () => {
          message.success("Username updated successfully!");

          try {
            // Wait for all asynchronous operations to complete
            await Promise.all([
              new Promise((resolve) => {
                window.localStorage.removeItem("username"); // Clear username from local storage
                resolve(null); // Resolve immediately as localStorage is synchronous
              }),
            ]);

            // Log out and redirect to signin page
            router.push("/signin");
          } catch (error) {
            console.error("Error completing all operations:", error);
            message.error(
              "An error occurred while processing your request. Please try again."
            );
          } finally {
            setIsChangeUsernameOpen(false); // Close the modal
          }
        },
        onError: (error: any) => {
          message.error(
            error.response?.data?.error ||
              "Failed to update the username. Please try again."
          );
          console.error("Error updating username:", error);
        },
      }
    );

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

  const isFollowing = followers.includes(loggedUser);

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
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            <Button
              style={{
                borderRadius: "20px",
                backgroundColor: "#85182a",
                color: "white",
                fontWeight: "bold",
                padding: "5px 15px",
                border: "none",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
              }}
              onClick={() => setIsChangeUsernameOpen(true)}
            >
              Change Username
            </Button>
            <Button
              style={{
                borderRadius: "20px",
                backgroundColor: "white",
                color: "#85182a",
                fontWeight: "bold",
                padding: "5px 15px",
                border: "none",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
              }}
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </div>
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

      {/* Change Username Modal */}
      <Modal
        title={
          <Typography.Title
            level={4}
            style={{ textAlign: "center", margin: 0 }}
          >
            Change Username
          </Typography.Title>
        }
        open={isChangeUsernameOpen}
        closable
        onCancel={() => setIsChangeUsernameOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsChangeUsernameOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            onClick={() => updateUsernameMutation(newUsername)}
            loading={isUpdatingUsername}
            disabled={!newUsername.trim()} // Disable if input is empty
          >
            Save Changes
          </Button>,
        ]}
      >
        <Input
          placeholder="Enter new username. Warning: You will be logged out."
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
      </Modal>
    </div>
  );
}
