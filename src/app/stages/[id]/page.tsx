"use client";

import { useState, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTypingEngine } from "@/hooks/useTypingEngine";
import { useTypingStore } from "@/store/typingStore";
import { useGameStore } from "@/store/gameStore";
import { STAGES, calculateStars, calculateExp } from "@/lib/gameData";
import { checkAchievements, triggerAchievements } from "@/lib/achievementChecker";
import { useTypingSound } from "@/hooks/useTypingSound";
import TypingArea from "@/components/TypingArea";
import StatsPanel from "@/components/StatsPanel";
import Keyboard from "@/components/Keyboard";
import ComboEffect from "@/components/ComboEffect";
import StarRating from "@/components/StarRating";

export default function StagePlayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: session } = useSession();
  const { addRecord, totalPractices, records } = useTypingStore();
  const gameStore = useGameStore();

  const stageId = parseInt(id);
  const stage = STAGES.find((s) => s.id === stageId);

  const [completed, setCompleted] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);
  const [earnedCoins, setEarnedCoins] = useState(0);

  const text = stage?.text || "";
  const { charStates, currentIndex, stats, lastKey, lastCorrect, handleKeyPress, reset } =
    useTypingEngine(text);

  useTypingSound(lastCorrect, stats.combo, stats.isComplete);

  const handleComplete = useCallback(() => {
    if (completed || !stage) return;
    setCompleted(true);

    const stars = calculateStars(stats.wpm, stats.accuracy, stage);
    const coins = stars > 0 ? stage.coins[stars - 1] : 0;
    setEarnedStars(stars);
    setEarnedCoins(coins);

    // Save to stores
    if (stars > 0) {
      gameStore.recordStage(stageId, stars);
      gameStore.addCoins(coins);
      const exp = calculateExp(stats.wpm, stats.accuracy);
      gameStore.addExp(exp);
    }

    const record = {
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      maxCombo: stats.maxCombo,
      durationSec: stats.elapsedSec,
      contentType: "english" as const,
      difficulty: "medium" as const,
      mode: `stage-${stageId}`,
    };
    addRecord(record);

    // Check achievements
    const recentAccuracies = records.slice(0, 4).map((r) => r.accuracy);
    const newAchievements = checkAchievements(
      { wpm: stats.wpm, accuracy: stats.accuracy, maxCombo: stats.maxCombo, totalChars: stats.correctChars + stats.errorChars },
      totalPractices + 1,
      { ...gameStore.stageStars, [stageId]: Math.max(gameStore.stageStars[stageId] || 0, stars) },
      gameStore.unlockedAchievements,
      recentAccuracies,
    );
    triggerAchievements(newAchievements, gameStore.unlockAchievement);

    // Save to server
    if (session?.user) {
      fetch("/api/practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      }).catch(() => {});
    }
  }, [completed, stage, stats, stageId, gameStore, addRecord, totalPractices, records, session]);

  if (stats.isComplete && !completed) {
    handleComplete();
  }

  if (!stage) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">关卡不存在</p>
      </div>
    );
  }

  const handleRestart = () => {
    setCompleted(false);
    setEarnedStars(0);
    setEarnedCoins(0);
    reset();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            关卡 {stage.id}：{stage.title}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            通关要求：WPM ≥ {stage.requiredWpm} · 准确率 ≥ {stage.requiredAccuracy}%
          </p>
        </div>
        <button onClick={() => router.push("/stages")} className="text-sm text-gray-400 hover:text-white">
          ← 返回关卡
        </button>
      </div>

      <StatsPanel stats={stats} />

      {!completed ? (
        <>
          <TypingArea
            charStates={charStates}
            currentIndex={currentIndex}
            onKeyPress={handleKeyPress}
            isCode={stage.text.includes("function") || stage.text.includes("const ")}
          />
          <Keyboard activeKey={lastKey} highlightFinger />
        </>
      ) : (
        <div className="bg-gray-800/50 rounded-xl border border-white/10 p-8 text-center space-y-5 animate-scale-in">
          <div className="text-5xl">
            {earnedStars === 0 ? "😢" : earnedStars === 3 ? "🌟" : earnedStars === 2 ? "⭐" : "✨"}
          </div>
          <h2 className="text-xl font-bold text-white">
            {earnedStars === 0 ? "未通关" : earnedStars === 3 ? "完美通关!" : "关卡通过!"}
          </h2>
          <StarRating stars={earnedStars} size="lg" />
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
              <div className="text-2xl font-bold text-yellow-400">
                {earnedCoins > 0 ? `+${earnedCoins}` : "0"}
              </div>
              <div className="text-xs text-gray-500">🪙 金币</div>
            </div>
          </div>
          <div className="flex gap-3 justify-center pt-2">
            <button onClick={handleRestart} className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg font-medium transition-colors">
              重试
            </button>
            {stageId < 20 && earnedStars > 0 && (
              <button onClick={() => router.push(`/stages/${stageId + 1}`)} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors">
                下一关 →
              </button>
            )}
            <button onClick={() => router.push("/stages")} className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg font-medium transition-colors">
              关卡列表
            </button>
          </div>
        </div>
      )}

      <ComboEffect combo={stats.combo} />
    </div>
  );
}
