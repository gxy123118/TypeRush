"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import type { PracticeRecord } from "@/store/typingStore";

interface GrowthChartProps {
  records: PracticeRecord[];
}

export default function GrowthChart({ records }: GrowthChartProps) {
  if (records.length < 2) {
    return (
      <div className="bg-gray-800/50 rounded-xl border border-white/5 p-8 text-center">
        <p className="text-gray-500">至少需要 2 条记录才能显示成长曲线</p>
      </div>
    );
  }

  const data = [...records]
    .reverse()
    .map((r, i) => ({
      index: i + 1,
      wpm: r.wpm,
      accuracy: r.accuracy,
      date: new Date(r.createdAt).toLocaleDateString("zh-CN", { month: "short", day: "numeric" }),
    }));

  return (
    <div className="bg-gray-800/50 rounded-xl border border-white/5 p-4">
      <h3 className="text-sm font-medium text-gray-400 mb-4 px-2">成长曲线</h3>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="wpmGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
          <YAxis stroke="#6b7280" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              color: "#fff",
            }}
          />
          <Area
            type="monotone"
            dataKey="wpm"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#wpmGradient)"
            name="WPM"
          />
          <Line
            type="monotone"
            dataKey="accuracy"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            name="准确率%"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
