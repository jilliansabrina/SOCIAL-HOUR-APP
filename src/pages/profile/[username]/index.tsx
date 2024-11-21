import Navigation from "@/components/Navigation";
import { useRouter } from "next/router";
import ProfileHeader from "@/components/ProfileHeader";
import { useUsername } from "@/shared/hooks/useLocalStorage";
import ProfileBody from "@/components/ProfileBody";

export default function () {
  const router = useRouter();
  const username = router.query.username as string;
  const [loggedUser] = useUsername() as string[];

  return (
    <div>
      <Navigation />
      <ProfileHeader username={username} loggedUser={loggedUser || ""} />
      <ProfileBody username={username} />
    </div>
  );
}
