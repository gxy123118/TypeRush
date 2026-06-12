"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useTypingEngine } from "@/hooks/useTypingEngine";
import { useTypingStore } from "@/store/typingStore";
import { getRandomContent, type ContentType, type Difficulty } from "@/lib/content";
import TypingArea from "@/components/TypingArea";
import StatsPanel from "@/components/StatsPanel";
import Keyboard from "@/components/Keyboard";
import ComboEffect from "@/components/ComboEffect";
import ContentSelector from "@/components/ContentSelector";
import ResultCard from "@/components/ResultCard";

export default function PracticePage() {
  const { data: session } = useSession();
  const addRecord = useTypingStore((s) => s.addRecord);

  const [contentType, setContentType] = useState<ContentType>("english");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [content, setContent] = useState(() => getRandomContent("english", "easy"));
  const [showResult, setShowResult] = useState(false);
  const [resultSaved, setResultSaved] = useState(false);

  const { charStates, currentIndex, stats, lastKey, handleKeyPress, reset } =
    useTypingEngine(content.text);

  // Save result when complete
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

    // Save to localStorage
    addRecord(record);

    // Save to server if logged in
    if (session?.user) {
      try {
        await fetch("/api/practice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(record),
        });
      } catch {
        // Silently fail — localStorage already has the record
      }
    }
  }, [stats, contentType, difficulty, addRecord, session, resultSaved]);

  // Show result card when complete
  if (stats.isComplete && !showResult) {
    setShowResult(true);
    saveResult();
  }

  const handleRestart = () => {
    setShowResult(false);
    setResultSaved(false);
    reset();
  };

  const handleNext = () => {
    setShowResult(false);
    setResultSaved(false);
    setContent(getRandomContent(contentType, difficulty));
  };

  const handleTypeChange = (type: ContentType) => {
    setContentType(type);
    setContent(getRandomContent(type, difficulty));
    setShowResult(false);
    setResultSaved(false);
    reset();
  };

  const handleDifficultyChange = (diff: Difficulty) => {
    setDifficulty(diff);
    setContent(getRandomContent(contentType, diff));
    setShowResult(false);
    setResultSaved(false);
    reset();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
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
          onRestart={handleRestart}
          onNext={handleNext}
        />
      )}
    </div>
  );
}
