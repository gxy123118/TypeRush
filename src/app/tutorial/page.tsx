"use client";

import { useState } from "react";
import { useTypingEngine } from "@/hooks/useTypingEngine";
import { useTypingSound } from "@/hooks/useTypingSound";
import TypingArea from "@/components/TypingArea";
import StatsPanel from "@/components/StatsPanel";
import Keyboard from "@/components/Keyboard";

const STAGES = [
  {
    title: "第1课：基准行 (ASDF JKL;)",
    description: "将手指放在基准行上，感受手指的自然位置。",
    text: "asdf jkl; asdf jkl; fjfj dkdk slsl a;a; ff jj dd kk ss ll aa ;; fj dk sl a;",
  },
  {
    title: "第2课：上行键 (QWER UIOP)",
    description: "从基准行向上移动手指，练习上行键。",
    text: "qwer uiop qwer uiop re ti re ti qw ui er op rew tip quite power write your",
  },
  {
    title: "第3课：下行键 (ZXCV BNM)",
    description: "从基准行向下移动手指，练习下行键。",
    text: "zxcv bnm zxcv bnm cv bn zx nm move come back next zero much very combine",
  },
  {
    title: "第4课：数字行 (1234567890)",
    description: "练习数字键，注意手指的伸展。",
    text: "1234 5678 90 12 34 56 78 90 100 200 365 2024 99 42 0 1 2 3 4 5 6 7 8 9",
  },
  {
    title: "第5课：综合练习",
    description: "综合运用所有按键，包括标点符号。",
    text: "The quick brown fox jumps over the lazy dog. Hello, World! Type 123 fast. Let's go! Can you reach 50 WPM?",
  },
];

export default function TutorialPage() {
  const [stageIndex, setStageIndex] = useState(0);
  const stage = STAGES[stageIndex];
  const { charStates, currentIndex, stats, lastKey, lastCorrect, handleKeyPress, reset } =
    useTypingEngine(stage.text);

  useTypingSound(lastCorrect, stats.combo, stats.isComplete);

  const handleNext = () => {
    if (stageIndex < STAGES.length - 1) {
      setStageIndex(stageIndex + 1);
    }
  };

  const handlePrev = () => {
    if (stageIndex > 0) {
      setStageIndex(stageIndex - 1);
    }
  };

  const handleRestart = () => {
    reset();
  };

  // Auto-advance when completed with good accuracy
  const canAdvance = stats.isComplete && stats.accuracy >= 80;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">打字教程</h1>
        <span className="text-sm text-gray-400">
          {stageIndex + 1} / {STAGES.length}
        </span>
      </div>

      {/* Stage info */}
      <div className="bg-gray-800/50 rounded-xl border border-white/5 p-4">
        <h2 className="text-lg font-semibold text-emerald-400 mb-1">
          {stage.title}
        </h2>
        <p className="text-sm text-gray-400">{stage.description}</p>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1">
        {STAGES.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < stageIndex
                ? "bg-emerald-500"
                : i === stageIndex
                ? "bg-emerald-500/50"
                : "bg-gray-800"
            }`}
          />
        ))}
      </div>

      <StatsPanel stats={stats} />

      <TypingArea
        charStates={charStates}
        currentIndex={currentIndex}
        onKeyPress={handleKeyPress}
      />

      <Keyboard activeKey={lastKey} highlightFinger />

      {/* Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={stageIndex === 0}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ← 上一课
        </button>

        <button
          onClick={handleRestart}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
        >
          重新开始
        </button>

        <button
          onClick={handleNext}
          disabled={stageIndex === STAGES.length - 1}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            canAdvance
              ? "bg-emerald-600 text-white hover:bg-emerald-500"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          } disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          下一课 →
        </button>
      </div>

      {stats.isComplete && (
        <div
          className={`text-center p-4 rounded-xl border ${
            stats.accuracy >= 80
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
              : "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
          }`}
        >
          {stats.accuracy >= 80 ? (
            <p>🎉 优秀！准确率 {stats.accuracy}%，速度 {stats.wpm} WPM。{stageIndex < STAGES.length - 1 ? "可以进入下一课了！" : "恭喜你完成了所有课程！"}</p>
          ) : (
            <p>准确率 {stats.accuracy}%，建议达到 80% 以上再进入下一课。再试一次吧！</p>
          )}
        </div>
      )}
    </div>
  );
}
