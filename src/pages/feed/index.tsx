import Navigation from "@/components/Navigation";
import { getPost } from "@/shared/datasource";
import { Button } from "antd";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

export default function () {
  const { data, isLoading } = useQuery({
    queryKey: ["fetch-posts"],
    queryFn: () => getPost(1),
  });
  useEffect(() => {
    console.log(data);
  }, [data]);
  return (
    <div>
      Hello Feed <Button>btn</Button>
      <Navigation />
    </div>
  );
}
