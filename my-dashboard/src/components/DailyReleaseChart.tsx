import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import  rawData from "../data/release_raw_data.json";
import { format, parseISO } from "date-fns";

const dailyData = rawData.reduce((acc: any, release) => {
  const date = format(parseISO(release.published_at), "yyyy-MM-dd");
  acc[date] = (acc[date] || 0) + 1;
  return acc;
}, {});

const chartData = Object.entries(dailyData).map(([date, count]) => ({ date, count }));

export function DailyReleaseChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="count" fill="#4f46e5" />
      </BarChart>
    </ResponsiveContainer>
  );
}
