import React, { useEffect, useState } from "react";
import { Table, message } from "antd";
import { fetchWorkoutStats } from "@/shared/datasource";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500"],
});

interface WorkoutStat {
  type: string;
  subtype: string;
  count: number;
}

export default function WorkoutStats({ username }: { username: string }) {
  const [data, setData] = useState<WorkoutStat[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      if (!username) {
        return; // Do not attempt to fetch data if username is unavailable
      }

      try {
        setLoading(true);
        const response = await fetchWorkoutStats(username);
        setData(response.data);
      } catch (error) {
        console.error("Failed to load workout stats:", error);
        message.error("Failed to load workout stats.");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [username]);

  // Grouped data for total sessions
  const typeTotals = data.reduce((acc: { [key: string]: number }, item) => {
    acc[item.type] = (acc[item.type] || 0) + item.count;
    return acc;
  }, {});

  const columns = [
    {
      title: "Exercise Type",
      dataIndex: "type",
      key: "type",
      render: (value: string, record: WorkoutStat, index: number) => {
        const groupCount = data.filter(
          (item) => item.type === record.type
        ).length;

        const firstOccurrenceIndex = data.findIndex(
          (item) => item.type === record.type
        );

        return {
          children: (
            <div
              style={{
                padding: "8px",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {value}
            </div>
          ),
          props: {
            rowSpan: index === firstOccurrenceIndex ? groupCount : 0,
          },
        };
      },
    },
    {
      title: "Total Sessions",
      dataIndex: "type",
      key: "totalSessions",
      render: (value: string, record: WorkoutStat, index: number) => {
        const groupCount = data.filter(
          (item) => item.type === record.type
        ).length;

        const firstOccurrenceIndex = data.findIndex(
          (item) => item.type === record.type
        );

        return {
          children: (
            <div
              style={{
                padding: "8px",
                textAlign: "center",
              }}
            >
              {index === firstOccurrenceIndex
                ? `${typeTotals[value]} sessions`
                : ""}
            </div>
          ),
          props: {
            rowSpan: index === firstOccurrenceIndex ? groupCount : 0,
          },
        };
      },
    },
    {
      title: "Subtype",
      dataIndex: "subtype",
      key: "subtype",
      render: (value: string) => (
        <div
          style={{
            padding: "8px",
            textAlign: "left",
          }}
        >
          {value || "None"}
        </div>
      ),
    },
    {
      title: "Count",
      dataIndex: "count",
      key: "count",
      render: (value: number) => (
        <div
          style={{
            padding: "8px",
            textAlign: "center",
          }}
        >
          {value} sessions
        </div>
      ),
    },
  ];

  if (!username) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "20px",
          color: "#85182a",
          fontWeight: "bold",
        }}
      >
        Please log in to view your workout statistics.
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        background: "#f6f8fa",
        borderRadius: "8px",
        boxShadow: "0 3px 5px rgba(0, 0, 0, 0.1)",
      }}
      className={montserrat.className}
    >
      <h2
        style={{
          textAlign: "center",
          fontWeight: "bold",
          color: "#85182a",
          marginBottom: "20px",
        }}
      >
        Workout Statistics
      </h2>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey={(record) => `${record.type}-${record.subtype}`}
        pagination={false}
        bordered
        style={{
          fontSize: "14px",
          background: "#fff",
          borderRadius: "8px",
          overflow: "hidden",
          border: "1px solid #ddd",
        }}
        rowClassName={(record, index) =>
          index % 2 === 0 ? "table-row-light" : "table-row-dark"
        }
      />
      <style jsx global>{`
        .table-row-light {
          background-color: #f4decd;
        }
        .table-row-dark {
          background-color: #e4b293;
        }
        .ant-table-thead > tr > th {
          background-color: #85182a !important;
          color: #fff !important;
          font-weight: bold;
          text-align: center !important;
          text-transform: uppercase;
        }
        .ant-table-cell {
          padding: 12px !important;
        }
      `}</style>
    </div>
  );
}
