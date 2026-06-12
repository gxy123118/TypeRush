"use client";

import { useSession } from "next-auth/react";
import { useTypingStore } from "@/store/typingStore";
import { useGameStore } from "@/store/gameStore";
import { ACHIEVEMENTS, ACHIEVEMENT_CATEGORIES, STAGES, getRank, getExpProgress } from "@/lib/gameData";
import LevelBadge from "@/components/LevelBadge";
import CoinDisplay from "@/components/CoinDisplay";
import StarRating from "@/components/StarRating";
import RequireAuth from "@/components/RequireAuth";
import Link from "next/link";

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileContent />
    </RequireAuth>
  );
}

function ProfileContent() {
  const { data: session } = useSession();
  const { records, bestWpm, totalPractices } = useTypingStore();
  const { coins, exp, level, unlockedAchievements, equippedTitle, equippedTheme, stageStars } = useGameStore();

  const rank = getRank(level);
  const expProgress = getExpProgress(exp);

  const avgWpm = records.length > 0
    ? Math.round(records.reduce((s, r) => s + r.wpm, 0) / records.length) : 0;
  const avgAccuracy = records.length > 0
    ? Math.round(records.reduce((s, r) => s + r.accuracy, 0) / records.length) : 0;
  const clearedStages = Object.keys(stageStars).filter((k) => stageStars[Number(k)] > 0).length;
  const totalStars = Object.values(stageStars).reduce((s, v) => s + v, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Profile header */}
      <div className="bg-gray-800/50 rounded-2xl border border-white/10 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar area */}
          <div className="relative">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl ${rank.bgColor} border-2 ${rank.color.replace("text-", "border-")}`}>
              {rank.icon}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-gray-900 rounded-full px-1.5 py-0.5 border border-white/10">
              <span className="text-xs font-bold text-white">Lv.{level}</span>
            </div>
          </div>

          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl font-bold text-white">
              {session?.user?.name || "未登录用户"}
            </h1>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2">
              <LevelBadge level={level} exp={exp} size="sm" />
              {equippedTitle && (
                <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 font-medium">
                  {equippedTitle}
                </span>
              )}
              <CoinDisplay amount={coins} />
            </div>

            {/* Exp progress bar */}
            <div className="mt-3 max-w-xs">
              <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                <span>EXP {expProgress.current}/{expProgress.next}</span>
                <span>{Math.round(expProgress.progress)}%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-700"
                  style={{ width: `${expProgress.progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="总练习" value={`${totalPractices}`} icon="📝" />
        <StatCard label="最高 WPM" value={`${bestWpm}`} icon="⚡" />
        <StatCard label="平均准确率" value={`${avgAccuracy}%`} icon="🎯" />
        <StatCard label="关卡进度" value={`${clearedStages}/20`} icon="🏰" extra={`⭐${totalStars}`} />
      </div>

      {/* Achievements */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">🏆 成就</h2>
          <span className="text-sm text-gray-400">
            {unlockedAchievements.length}/{ACHIEVEMENTS.length} 已解锁
          </span>
        </div>

        {ACHIEVEMENT_CATEGORIES.map((cat) => {
          const catAchievements = ACHIEVEMENTS.filter((a) => a.category === cat.key);
          return (
            <div key={cat.key} className="mb-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">
                {cat.icon} {cat.label}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {catAchievements.map((achievement) => {
                  const unlocked = unlockedAchievements.includes(achievement.id);
                  return (
                    <div
                      key={achievement.id}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors ${
                        unlocked
                          ? "border-yellow-500/20 bg-yellow-500/5"
                          : "border-white/5 bg-gray-900/50 opacity-50"
                      }`}
                    >
                      <span className="text-2xl">{unlocked ? achievement.icon : "🔒"}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">{achievement.name}</div>
                        <div className="text-xs text-gray-400 truncate">{achievement.description}</div>
                      </div>
                      <div className="text-xs font-medium shrink-0">
                        {unlocked
                          ? <span className="text-emerald-400">✓ 已达成</span>
                          : <span className="text-gray-600">未达成</span>
                        }
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick links */}
      {!session?.user && (
        <div className="bg-gray-800/50 rounded-xl border border-white/5 p-6 text-center">
          <p className="text-gray-400 mb-3">登录后可将进度同步到服务器</p>
          <Link href="/auth/login" className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors">
            登录
          </Link>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, extra }: { label: string; value: string; icon: string; extra?: string }) {
  return (
    <div className="bg-gray-800/50 rounded-xl border border-white/5 px-4 py-4 text-center">
      <div className="text-xl mb-1">{icon}</div>
      <div className="text-xl font-bold text-white">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
      {extra && <div className="text-xs text-yellow-400 mt-1">{extra}</div>}
    </div>
  );
}
