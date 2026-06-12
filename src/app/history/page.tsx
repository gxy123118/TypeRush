"use client";

import { useTypingStore } from "@/store/typingStore";
import GrowthChart from "@/components/GrowthChart";

export default function HistoryPage() {
  const { records, bestWpm, totalPractices } = useTypingStore();
  const recentRecords = records.slice(0, 30);

  const avgWpm =
    records.length > 0
      ? Math.round(records.reduce((sum, r) => sum + r.wpm, 0) / records.length)
      : 0;
  const avgAccuracy =
    records.length > 0
      ? Math.round(records.reduce((sum, r) => sum + r.accuracy, 0) / records.length)
      : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-white">历史记录</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SummaryCard label="总练习次数" value={`${totalPractices}`} color="text-blue-400" />
        <SummaryCard label="最高速度" value={`${bestWpm} WPM`} color="text-emerald-400" />
        <SummaryCard label="平均速度" value={`${avgWpm} WPM`} color="text-yellow-400" />
        <SummaryCard label="平均准确率" value={`${avgAccuracy}%`} color="text-purple-400" />
      </div>

      {/* Growth chart */}
      <GrowthChart records={recentRecords} />

      {/* Records table */}
      {recentRecords.length > 0 ? (
        <div className="bg-gray-800/50 rounded-xl border border-white/5 overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5">
            <h3 className="text-sm font-medium text-gray-400">最近记录</h3>
          </div>
          <div className="divide-y divide-white/5">
            {recentRecords.map((r) => (
              <div
                key={r.id}
                className="px-4 py-3 flex items-center justify-between text-sm hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 w-28">
                    {new Date(r.createdAt).toLocaleString("zh-CN", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <TypeBadge type={r.contentType} />
                  <DiffBadge diff={r.difficulty} />
                  {r.mode !== "practice" && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400">
                      {r.mode.replace("challenge-", "")}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-emerald-400 font-medium">{r.wpm} WPM</span>
                  <span className="text-gray-400">{r.accuracy}%</span>
                  <span className="text-gray-500">🔥{r.maxCombo}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-gray-800/50 rounded-xl border border-white/5 p-12 text-center">
          <p className="text-gray-500 text-lg">还没有练习记录</p>
          <p className="text-gray-600 text-sm mt-1">开始你的第一次练习吧！</p>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-gray-800/50 rounded-xl border border-white/5 px-4 py-4 text-center">
      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</div>
      <div className={`text-xl font-bold ${color}`}>{value}</div>
    </div>
  );
}

function TypeBadge({ type }: { type: string }) {
  const config: Record<string, { label: string; color: string }> = {
    english: { label: "英文", color: "bg-blue-500/20 text-blue-400" },
    chinese: { label: "中文", color: "bg-orange-500/20 text-orange-400" },
    code: { label: "代码", color: "bg-green-500/20 text-green-400" },
  };
  const c = config[type] || config.english;
  return <span className={`text-xs px-1.5 py-0.5 rounded ${c.color}`}>{c.label}</span>;
}

function DiffBadge({ diff }: { diff: string }) {
  const config: Record<string, { label: string; color: string }> = {
    easy: { label: "简单", color: "bg-emerald-500/20 text-emerald-400" },
    medium: { label: "中等", color: "bg-yellow-500/20 text-yellow-400" },
    hard: { label: "困难", color: "bg-red-500/20 text-red-400" },
  };
  const c = config[diff] || config.easy;
  return <span className={`text-xs px-1.5 py-0.5 rounded ${c.color}`}>{c.label}</span>;
}
