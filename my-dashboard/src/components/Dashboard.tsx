import { DailyReleaseChart } from "./DailyReleaseChart";
import { Card } from "./Card";

export function Dashboard() {
  return (
    <div style={{ display: "grid", gap: "24px", padding: "32px" }}>
      <Card title="📅 일별 릴리즈 수">
        <DailyReleaseChart />
      </Card>
    </div>
  );
}
