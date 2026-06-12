"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useTypingEngine } from "@/hooks/useTypingEngine";
import { useTypingStore } from "@/store/typingStore";
import { useGameStore } from "@/store/gameStore";
import { getRandomContent } from "@/lib/content";
import { calculateExp } from "@/lib/gameData";
import { checkAchievements, triggerAchievements } from "@/lib/achievementChecker";
import { useTypingSound } from "@/hooks/useTypingSound";
import TypingArea from "@/components/TypingArea";
import StatsPanel from "@/components/StatsPanel";
import ComboEffect from "@/components/ComboEffect";

type ChallengeType = "timed" | "perfect" | "personal-best";

const CHALLENGE_CONFIG = {
  timed: { label: "⏱️ 限时挑战", desc: "60秒内尽可能打更多字", duration: 60 },
  perfect: { label: "💎 完美挑战", desc: "零失误完成整段文字" },
  "personal-best": { label: "🏆 超越自我", desc: "超越你的个人最佳 WPM" },
};

export default function ChallengePage() {
  const { data: session } = useSession();
  const { bestWpm, addRecord, totalPractices, records } = useTypingStore();
  const gameStore = useGameStore();
  const [challengeType, setChallengeType] = useState<ChallengeType | null>(null);
  const [content, setContent] = useState(() => getRandomContent("english", "medium"));
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimedComplete, setIsTimedComplete] = useState(false);
  const [resultSaved, setResultSaved] = useState(false);

  const { charStates, currentIndex, stats, lastKey, lastCorrect, handleKeyPress, reset } =
    useTypingEngine(content.text);

  useTypingSound(lastCorrect, stats.combo, stats.isComplete);

  useEffect(() => {
    if (challengeType !== "timed") return;
    if (stats.elapsedSec === 0) return;
    const remaining = 60 - stats.elapsedSec;
    setTimeLeft(Math.max(0, remaining));
    if (remaining <= 0 && !isTimedComplete) setIsTimedComplete(true);
  }, [stats.elapsedSec, challengeType, isTimedComplete]);

  const perfectFailed = challengeType === "perfect" && stats.errorChars > 0;
  const beatPersonalBest = challengeType === "personal-best" && stats.isComplete && stats.wpm > bestWpm;
  const isComplete = stats.isComplete || isTimedComplete || perfectFailed;

  const saveResult = useCallback(async () => {
    if (resultSaved || !challengeType) return;
    setResultSaved(true);

    const record = {
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      maxCombo: stats.maxCombo,
      durationSec: stats.elapsedSec,
      contentType: "english" as const,
      difficulty: "medium" as const,
      mode: `challenge-${challengeType}`,
    };

    addRecord(record);

    // Award exp & coins
    const exp = calculateExp(stats.wpm, stats.accuracy);
    gameStore.addExp(exp);
    const coins = Math.round(stats.wpm * (stats.accuracy / 100) * 0.4);
    if (coins > 0) gameStore.addCoins(coins);

    // Check achievements
    const recentAccuracies = records.slice(0, 4).map((r) => r.accuracy);
    const newAchievements = checkAchievements(
      { wpm: stats.wpm, accuracy: stats.accuracy, maxCombo: stats.maxCombo, totalChars: stats.correctChars + stats.errorChars },
      totalPractices + 1,
      gameStore.stageStars,
      gameStore.unlockedAchievements,
      recentAccuracies,
    );
    triggerAchievements(newAchievements, gameStore.unlockAchievement);

    if (session?.user) {
      try {
        await fetch("/api/practice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(record),
        });
      } catch {}
    }
  }, [stats, challengeType, addRecord, session, resultSaved, gameStore, totalPractices, records]);

  useEffect(() => {
    if (isComplete && !resultSaved) saveResult();
  }, [isComplete, resultSaved, saveResult]);

  const handleStart = (type: ChallengeType) => {
    setChallengeType(type);
    setContent(getRandomContent("english", "medium"));
    setTimeLeft(60);
    setIsTimedComplete(false);
    setResultSaved(false);
    reset();
  };

  const handleRestart = () => {
    setContent(getRandomContent("english", "medium"));
    setTimeLeft(60);
    setIsTimedComplete(false);
    setResultSaved(false);
    reset();
  };

  if (!challengeType) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-white">挑战模式</h1>
        <div className="grid gap-4 sm:grid-cols-3">
          {(Object.entries(CHALLENGE_CONFIG) as [ChallengeType, typeof CHALLENGE_CONFIG.timed][]).map(
            ([type, config]) => (
              <button
                key={type}
                onClick={() => handleStart(type)}
                className="p-6 rounded-xl border border-white/10 bg-gray-800/50 hover:bg-gray-800 hover:border-emerald-500/30 transition-all text-left group"
              >
                <div className="text-2xl mb-2">{config.label.split(" ")[0]}</div>
                <div className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
                  {config.label.split(" ").slice(1).join(" ")}
                </div>
                <div className="text-sm text-gray-400 mt-1">{config.desc}</div>
                {type === "personal-best" && (
                  <div className="text-sm text-emerald-400 mt-2">当前最佳：{bestWpm} WPM</div>
                )}
              </button>
            )
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{CHALLENGE_CONFIG[challengeType].label}</h1>
        <button onClick={() => setChallengeType(null)} className="text-sm text-gray-400 hover:text-white transition-colors">
          ← 返回选择
        </button>
      </div>

      {challengeType === "timed" && (
        <div className={`text-center text-4xl font-black ${timeLeft <= 10 ? "text-red-400 animate-pulse" : "text-emerald-400"}`}>
          {timeLeft}s
        </div>
      )}

      <StatsPanel stats={stats} />

      {!isComplete ? (
        <TypingArea
          charStates={charStates}
          currentIndex={currentIndex}
          onKeyPress={(key) => { if (!isTimedComplete) handleKeyPress(key); }}
        />
      ) : (
        <div className="bg-gray-800/50 rounded-xl border border-white/10 p-8 text-center space-y-4 animate-scale-in">
          <div className="text-4xl">
            {perfectFailed ? "😢" : beatPersonalBest ? "🏆" : stats.wpm >= 60 ? "🎉" : "👍"}
          </div>
          <h2 className="text-xl font-bold text-white">
            {perfectFailed ? "挑战失败" : beatPersonalBest ? "新纪录！" : challengeType === "timed" ? "时间到！" : "挑战完成！"}
          </h2>
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
            <div>
              <div className="text-2xl font-bold text-emerald-400">{stats.wpm}</div>
              <div className="text-xs text-gray-500">WPM</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">{stats.accuracy}%</div>
              <div className="text-xs text-gray-500">准确率</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">{stats.maxCombo}</div>
              <div className="text-xs text-gray-500">最大连击</div>
            </div>
          </div>
          <div className="flex gap-3 justify-center pt-2">
            <button onClick={handleRestart} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors">
              再来一次
            </button>
            <button onClick={() => setChallengeType(null)} className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg font-medium transition-colors">
              选择其他
            </button>
          </div>
        </div>
      )}

      <ComboEffect combo={stats.combo} />
    </div>
  );
}
