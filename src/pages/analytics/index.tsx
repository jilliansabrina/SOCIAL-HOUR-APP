import React, { useState, useEffect } from "react";
import { Divider, DatePicker, Progress, message, Card } from "antd";
import { Montserrat } from "next/font/google";
import Navigation from "@/components/Navigation";
import { fetchUserPostsByYear } from "@/shared/datasource";
import { useUsername } from "@/shared/hooks/useLocalStorage";
import HeatmapYear from "@/components/HeatmapYear";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500"],
});

type HeatmapData = { date: string; count: number };

const currentYear = new Date().getFullYear();

export default function Analytics() {
  const [totalPosts, setTotalPosts] = useState(0); // State for total post count
  const [year, setYear] = useState(currentYear);
  const [heatmapData, setHeatmapData] = useState<
    { date: string; count: number }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const [storedUsername] = useUsername() as [
    string,
    (value: string | null) => void
  ];
  const username = storedUsername || "";

  const loadHeatmapData = async (selectedYear: number) => {
    if (!username || !selectedYear) {
      console.error("Username or year is invalid.");
      return; // Exit early if username or year is missing
    }

    try {
      setLoading(true); // Indicate loading state
      const response = await fetchUserPostsByYear(username, selectedYear);

      // Access `data` before mapping
      const formattedData: HeatmapData[] = response.data.map((post) => ({
        date: post.date,
        count: post.count,
      }));

      const total = response.data.reduce((sum, post) => sum + post.count, 0); // Calculate total posts
      setTotalPosts(total); // Update total post count

      setHeatmapData(formattedData); // Assign the formatted data
    } catch (error) {
      console.error("Error loading heatmap data:", error);
      message.error("Failed to load heatmap data.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  useEffect(() => {
    if (username) {
      loadHeatmapData(year);
    }
  }, [year, username]);

  const handleYearChange = (date: any) => {
    if (date) {
      setYear(date.year());
    }
  };

  return (
    <div
      style={{ backgroundColor: "#f6f8fa", minHeight: "100vh" }}
      className={montserrat.className}
    >
      <Navigation />
      <div
        style={{
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h2 className={`${montserrat.className}`}>Annual Overview</h2>
        <DatePicker onChange={handleYearChange} picker="year" />
        <h2 className={`${montserrat.className}`}>{year}</h2>

        <HeatmapYear data={heatmapData} year={year} loading={loading} />

        <Card
          style={{
            width: "250px", // Reduced width
            textAlign: "center",
            marginTop: "20px",
            borderRadius: "12px", // Slightly smaller radius
            boxShadow: "0 3px 5px rgba(0, 0, 0, 0.1)", // Adjusted shadow for a subtler effect
            backgroundColor: "#85182a",
            color: "white",
          }}
        >
          <h3
            className={`${montserrat.className}`}
            style={{ margin: 0, fontSize: "1.2rem" }}
          >
            {" "}
            {/* Slightly smaller font */}
            Total Posts
          </h3>
          <h1
            className={`${montserrat.className}`}
            style={{
              fontSize: "2.5rem", // Reduced size of the number
              margin: "8px 0", // Reduced margin
              color: "#f4decd", // Accent color matching the heatmap
            }}
          >
            {totalPosts}
          </h1>
          <p
            className={`${montserrat.className}`}
            style={{ margin: 0, fontSize: "0.9rem", color: "#ffffffb3" }} // Smaller text
          >
            in {year}
          </p>
        </Card>

        <div style={{ width: "50%" }}>
          <Divider />
          <h2
            className={`${montserrat.className}`}
            style={{ display: "flex", justifyContent: "center" }}
          >
            Sessions
          </h2>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Progress
              type="circle"
              percent={100}
              status="active"
              strokeColor={"#85182a"}
              format={() => "10:30"}
            />
            <Progress
              type="circle"
              percent={100}
              status="active"
              strokeColor={"#85182a"}
              format={() => "3 Cardio"}
            />
            <Progress
              type="circle"
              percent={100}
              status="active"
              strokeColor={"#85182a"}
              format={() => "1 Swim"}
            />
            <Progress
              type="circle"
              percent={100}
              status="active"
              strokeColor={"#85182a"}
              format={() => "4 Lifts"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
