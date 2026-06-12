"use client";

import type { TypingStats } from "@/hooks/useTypingEngine";

interface StatsPanelProps {
  stats: TypingStats;
}

export default function StatsPanel({ stats }: StatsPanelProps) {
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <StatCard
        label="速度"
        value={`${stats.wpm}`}
        unit="WPM"
        color="text-amber-300"
      />
      <StatCard
        label="准确率"
        value={`${stats.accuracy}`}
        unit="%"
        color={stats.accuracy >= 95 ? "text-teal-400" : stats.accuracy >= 80 ? "text-stone-300" : "text-rose-400"}
      />
      <StatCard
        label="连击"
        value={`${stats.combo}`}
        unit={stats.combo >= 10 ? "🔥" : ""}
        color={stats.combo >= 25 ? "text-orange-400" : stats.combo >= 10 ? "text-amber-400" : "text-stone-400"}
      />
      <StatCard
        label="时间"
        value={formatTime(stats.elapsedSec)}
        unit=""
        color="text-stone-300"
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: string;
  unit: string;
  color: string;
}) {
  return (
    <div className="bg-[#1a1918]/60 rounded-lg border border-white/[0.06] px-4 py-3 text-center">
      <div className="text-xs text-stone-500 uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className={`text-2xl font-bold ${color}`}>
        {value}
        {unit && <span className="text-sm ml-1">{unit}</span>}
      </div>
    </div>
  );
}
