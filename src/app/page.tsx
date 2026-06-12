"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useTypingEngine } from "@/hooks/useTypingEngine";
import { useTypingStore } from "@/store/typingStore";
import { useGameStore } from "@/store/gameStore";
import { getRandomContent, type ContentType, type Difficulty } from "@/lib/content";
import { calculateExp } from "@/lib/gameData";
import { checkAchievements, triggerAchievements } from "@/lib/achievementChecker";
import { useTypingSound } from "@/hooks/useTypingSound";
import TypingArea from "@/components/TypingArea";
import StatsPanel from "@/components/StatsPanel";
import Keyboard from "@/components/Keyboard";
import ComboEffect from "@/components/ComboEffect";
import ContentSelector from "@/components/ContentSelector";
import ResultCard from "@/components/ResultCard";

export default function PracticePage() {
  const { data: session } = useSession();
  const { addRecord, totalPractices, records } = useTypingStore();
  const gameStore = useGameStore();

  const [contentType, setContentType] = useState<ContentType>("english");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [content, setContent] = useState(() => getRandomContent("english", "easy"));
  const [showResult, setShowResult] = useState(false);
  const [resultSaved, setResultSaved] = useState(false);
  const [earnedCoins, setEarnedCoins] = useState(0);

  const { charStates, currentIndex, stats, lastKey, lastCorrect, handleKeyPress, reset } =
    useTypingEngine(content.text);

  useTypingSound(lastCorrect, stats.combo, stats.isComplete);

  const saveResult = useCallback(async () => {
    if (resultSaved) return;
    setResultSaved(true);

    const record = {
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      maxCombo: stats.maxCombo,
      durationSec: stats.elapsedSec,
      contentType,
      difficulty,
      mode: "practice",
    };

    addRecord(record);

    // 只有登录用户才累积金币/经验/成就
    if (session?.user) {
      const exp = calculateExp(stats.wpm, stats.accuracy);
      gameStore.addExp(exp);
      const baseCoins = Math.round(stats.wpm * (stats.accuracy / 100) * 0.3);
      if (baseCoins > 0) {
        gameStore.addCoins(baseCoins);
        setEarnedCoins(baseCoins);
      }

      const recentAccuracies = records.slice(0, 4).map((r) => r.accuracy);
      const newAchievements = checkAchievements(
        { wpm: stats.wpm, accuracy: stats.accuracy, maxCombo: stats.maxCombo, totalChars: stats.correctChars + stats.errorChars },
        totalPractices + 1,
        gameStore.stageStars,
        gameStore.unlockedAchievements,
        recentAccuracies,
      );
      triggerAchievements(newAchievements, gameStore.unlockAchievement);

      try {
        await fetch("/api/practice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(record),
        });
      } catch {}
    }
  }, [stats, contentType, difficulty, addRecord, session, resultSaved, gameStore, totalPractices, records]);

  const completedRef = useRef(false);

  useEffect(() => {
    if (stats.isComplete && !completedRef.current) {
      completedRef.current = true;
      // Defer state updates to avoid setState-in-render
      queueMicrotask(() => {
        setShowResult(true);
        saveResult();
      });
    }
  }, [stats.isComplete, saveResult]);

  const handleRestart = () => {
    completedRef.current = false;
    setShowResult(false);
    setResultSaved(false);
    setEarnedCoins(0);
    reset();
  };

  const handleNext = () => {
    completedRef.current = false;
    setShowResult(false);
    setResultSaved(false);
    setEarnedCoins(0);
    setContent(getRandomContent(contentType, difficulty));
  };

  const handleTypeChange = (type: ContentType) => {
    completedRef.current = false;
    setContentType(type);
    setContent(getRandomContent(type, difficulty));
    setShowResult(false);
    setResultSaved(false);
    setEarnedCoins(0);
    reset();
  };

  const handleDifficultyChange = (diff: Difficulty) => {
    completedRef.current = false;
    setDifficulty(diff);
    setContent(getRandomContent(contentType, diff));
    setShowResult(false);
    setResultSaved(false);
    setEarnedCoins(0);
    reset();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-white">打字练习</h1>
        <ContentSelector
          contentType={contentType}
          difficulty={difficulty}
          onTypeChange={handleTypeChange}
          onDifficultyChange={handleDifficultyChange}
        />
      </div>

      <StatsPanel stats={stats} />

      <TypingArea
        charStates={charStates}
        currentIndex={currentIndex}
        onKeyPress={handleKeyPress}
        isCode={contentType === "code"}
      />

      <Keyboard activeKey={lastKey} highlightFinger />
      <ComboEffect combo={stats.combo} />

      {showResult && (
        <ResultCard
          stats={stats}
          earnedCoins={earnedCoins}
          onRestart={handleRestart}
          onNext={handleNext}
        />
      )}
    </div>
  );
}
