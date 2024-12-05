import { Avatar, Button, List, Modal } from "antd";
import { followUser, unfollowUser, fetchUser } from "@/shared/datasource";
import { useQuery, useMutation } from "react-query";
import { useState, useEffect } from "react";
import { fetchFollowing, fetchFollowers } from "@/shared/datasource";
import { Spin } from "antd";
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

  // Close modals when the profile changes
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

  // Fetch following list
  const refreshFollowing = async () => {
    try {
      const response = await fetchFollowing(username);
      setFollowing(response.data);
    } catch (error) {
      console.error("Error fetching following:", error);
    }
  };

  const openFollowersModal = async () => {
    await refreshFollowers(); // Ensure the followers list is up-to-date
    setIsFollowersModalOpen(true);
  };

  const openFollowingModal = async () => {
    await refreshFollowing(); // Ensure the following list is up-to-date
    setIsFollowingModalOpen(true);
  };

  const isLoading =
    isFetchingProfile || isFollowingLoading || isUnfollowingLoading;

  const isFollowing = Boolean(profileData?.followers.length ?? 0 > 0);

  return (
    <div>
      <Avatar style={{ backgroundColor: "#85182a", color: "black" }}>
        {(username ?? " ")[0]?.toUpperCase()}
      </Avatar>
      <h1>{`@${username}`}</h1>

      {isLoading ? (
        <Spin size="large" />
      ) : (
        <div style={{ marginTop: "10px" }}>
          <Button type="link" onClick={openFollowersModal}>
            {followers.length || 0} Followers
          </Button>
          <Button type="link" onClick={openFollowingModal}>
            {following.length || 0} Following
          </Button>
        </div>
      )}

      {username === loggedUser ? (
        <Button>Edit Profile</Button>
      ) : isFollowing ? (
        <Button onClick={() => unfollowUserMutation()} loading={isLoading}>
          Unfollow
        </Button>
      ) : (
        <Button onClick={() => followUserMutation()} loading={isLoading}>
          Follow
        </Button>
      )}
      {/* Followers Modal */}
      <Modal
        title="Followers"
        open={isFollowersModalOpen}
        closable={true}
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

      {/* Following Modal */}
      <Modal
        title="Following"
        closable={true}
        open={isFollowingModalOpen}
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
