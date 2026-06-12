"use client";

import { useEffect, useState } from "react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  wpm: number;
  accuracy: number;
  maxCombo: number;
  date: string;
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        setEntries(data.entries || []);
      })
      .catch(() => {
        setEntries([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-white">🏆 排行榜</h1>
      <p className="text-gray-400 text-sm">Top 50 — 按最高 WPM 排名</p>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 bg-gray-800/50 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="bg-gray-800/50 rounded-xl border border-white/5 p-12 text-center">
          <p className="text-4xl mb-2">🏆</p>
          <p className="text-gray-500 text-lg">排行榜暂无数据</p>
          <p className="text-gray-600 text-sm mt-1">登录后完成练习即可上榜！</p>
        </div>
      ) : (
        <div className="bg-gray-800/50 rounded-xl border border-white/5 overflow-hidden">
          <div className="grid grid-cols-[60px_1fr_100px_80px_80px] px-4 py-2 border-b border-white/5 text-xs text-gray-500 uppercase tracking-wider">
            <span>排名</span>
            <span>用户</span>
            <span className="text-right">WPM</span>
            <span className="text-right">准确率</span>
            <span className="text-right">连击</span>
          </div>
          <div className="divide-y divide-white/5">
            {entries.map((entry) => (
              <div
                key={entry.rank}
                className={`grid grid-cols-[60px_1fr_100px_80px_80px] px-4 py-3 items-center hover:bg-white/5 transition-colors ${
                  entry.rank <= 3 ? "bg-yellow-500/5" : ""
                }`}
              >
                <span className="text-lg font-bold">
                  {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : entry.rank}
                </span>
                <span className="text-white font-medium truncate">{entry.name}</span>
                <span className="text-right text-emerald-400 font-bold">{entry.wpm} WPM</span>
                <span className="text-right text-gray-400">{entry.accuracy}%</span>
                <span className="text-right text-gray-500">🔥{entry.maxCombo}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
