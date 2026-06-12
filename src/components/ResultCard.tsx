"use client";

import { useEffect } from "react";
import type { TypingStats } from "@/hooks/useTypingEngine";

interface ResultCardProps {
  stats: TypingStats;
  onRestart: () => void;
  onNext: () => void;
}

function getGrade(wpm: number, accuracy: number): { grade: string; color: string; label: string } {
  const score = wpm * (accuracy / 100);
  if (score >= 80) return { grade: "S", color: "text-purple-400", label: "完美!" };
  if (score >= 60) return { grade: "A", color: "text-emerald-400", label: "优秀!" };
  if (score >= 40) return { grade: "B", color: "text-blue-400", label: "良好" };
  if (score >= 20) return { grade: "C", color: "text-yellow-400", label: "及格" };
  return { grade: "D", color: "text-red-400", label: "继续努力" };
}

export default function ResultCard({ stats, onRestart, onNext }: ResultCardProps) {
  const { grade, color, label } = getGrade(stats.wpm, stats.accuracy);

  useEffect(() => {
    // Confetti effect for good results
    if (stats.wpm >= 40 && stats.accuracy >= 90) {
      import("canvas-confetti").then((confetti) => {
        confetti.default({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      });
    }
  }, [stats.wpm, stats.accuracy]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center mb-6">
          <div className={`text-7xl font-black ${color} mb-2`}>{grade}</div>
          <div className={`text-xl font-semibold ${color}`}>{label}</div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <ResultStat label="打字速度" value={`${stats.wpm} WPM`} />
          <ResultStat label="准确率" value={`${stats.accuracy}%`} />
          <ResultStat label="最大连击" value={`${stats.maxCombo}`} />
          <ResultStat label="用时" value={`${stats.elapsedSec}秒`} />
          <ResultStat label="正确字符" value={`${stats.correctChars}`} />
          <ResultStat label="错误字符" value={`${stats.errorChars}`} />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onRestart}
            className="flex-1 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg font-medium transition-colors"
          >
            重新开始
          </button>
          <button
            onClick={onNext}
            className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
          >
            下一篇
          </button>
        </div>
      </div>
    </div>
  );
}

function ResultStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-800/50 rounded-lg px-3 py-2">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-lg font-semibold text-white">{value}</div>
    </div>
  );
}
