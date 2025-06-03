import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// 예시 데이터
const dailyData = [
  { date: "2025-05-30", count: 5 },
  { date: "2025-05-31", count: 3 },
  { date: "2025-06-01", count: 7 },
];

const tagData = [
  { tag: "v1.0.0", count: 4 },
  { tag: "v1.1.0", count: 6 },
  { tag: "v2.0.0", count: 5 },
];

type TabsProps = {
  tabs: string[];
  selectedTab: string;
  onSelect: (tab: string) => void;
};

// 탭 버튼 컴포넌트
function Tabs({ tabs, selectedTab, onSelect }: TabsProps) {
  return (
    <div style={{ display: "flex", marginBottom: 20 }}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onSelect(tab)}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            borderBottom: selectedTab === tab ? "2px solid blue" : "none",
            backgroundColor: selectedTab === tab ? "#eef" : "white",
            border: "none",
            outline: "none",
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

type CardProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
};

// 카드 컴포넌트
function Card({ children }: CardProps) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: 20,
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        backgroundColor: "white",
      }}
    >
      {children}
    </div>
  );
}

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState("일별 배포 수");

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>GitHub Releases Dashboard</h1>

      <Tabs
        tabs={["일별 배포 수", "태그별 배포 수"]}
        selectedTab={selectedTab}
        onSelect={setSelectedTab}
      />

      <Card>
        {selectedTab === "일별 배포 수" && (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        )}

        {selectedTab === "태그별 배포 수" && (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tagData}>
              <XAxis dataKey="tag" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  );
}
