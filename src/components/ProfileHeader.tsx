import { Avatar, Button } from "antd";
import { followUser, unfollowUser, fetchUser } from "@/shared/datasource";
import { useQuery, useMutation } from "react-query";

interface ProfileHeaderProps {
  username: string;
  loggedUser: string;
}

export default function ProfileHeader({
  username,
  loggedUser,
}: ProfileHeaderProps) {
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
      },
    });

  const { mutate: unfollowUserMutation, isLoading: isUnfollowingLoading } =
    useMutation({
      mutationKey: ["unfollow-user", username],
      mutationFn: () => unfollowUser(username),
      onSuccess: async () => {
        await refetch();
      },
    });

  const isLoading =
    isFetchingProfile || isFollowingLoading || isUnfollowingLoading;

  const isFollowing = Boolean(profileData?.followers.length ?? 0 > 0);

  return (
    <div>
      <Avatar style={{ backgroundColor: "#85182a", color: "black" }}>
        {(username ?? " ")[0]?.toUpperCase()}
      </Avatar>
      <h1>{`@${username}`}</h1>
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
    </div>
  );
}
