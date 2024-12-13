import React from "react";
import HeatMap from "@uiw/react-heat-map";
import { Tooltip } from "antd";

type HeatmapData = { date: string; count: number };

interface HeatmapProps {
  data: HeatmapData[];
  year: number;
  loading: boolean;
}

const HeatmapComponent: React.FC<HeatmapProps> = ({ data, year, loading }) => {
  return (
    <>
      {loading ? <p>Loading heatmap...</p> : null}
      <HeatMap
        value={data}
        width={750}
        style={{ color: "#ad001d" }}
        startDate={new Date(`${year}-01-01`)}
        endDate={new Date(`${year}-12-31`)}
        panelColors={{
          0: "#f4decd",
          1: "#e4b293",
          2: "#d48462",
          4: "#c2533a",
          6: "#ad001d",
          100: "#000",
        }}
        rectProps={{
          rx: 3,
        }}
        rectRender={(props, data) => {
          const formattedDate = data?.date
            ? new Date(data.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "No Date";

          const tooltipContent = data?.count
            ? `${data.count} posts on ${formattedDate}`
            : `No posts on ${formattedDate}`;

          return (
            <Tooltip placement="top" title={tooltipContent}>
              <rect {...props} />
            </Tooltip>
          );
        }}
      />
    </>
  );
};

export default HeatmapComponent;
