"use client";

import { useEffect } from "react";
import type { TypingStats } from "@/hooks/useTypingEngine";

interface ResultCardProps {
  stats: TypingStats;
  earnedCoins?: number;
  onRestart: () => void;
  onNext: () => void;
  onClose?: () => void;
}

function getGrade(wpm: number, accuracy: number): { grade: string; color: string; label: string } {
  const score = wpm * (accuracy / 100);
  if (score >= 60) return { grade: "S", color: "text-purple-400", label: "完美!" };
  if (score >= 40) return { grade: "A", color: "text-amber-300", label: "优秀!" };
  if (score >= 25) return { grade: "B", color: "text-teal-400", label: "良好" };
  if (score >= 12) return { grade: "C", color: "text-stone-300", label: "不错" };
  return { grade: "D", color: "text-rose-400", label: "继续努力" };
}

export default function ResultCard({ stats, earnedCoins, onRestart, onNext, onClose }: ResultCardProps) {
  const { grade, color, label } = getGrade(stats.wpm, stats.accuracy);

  useEffect(() => {
    if (stats.wpm >= 30 && stats.accuracy >= 85) {
      import("canvas-confetti").then((confetti) => {
        confetti.default({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      });
    }
  }, [stats.wpm, stats.accuracy]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#1c1b19] border border-white/[0.08] rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-scale-in relative">
        {/* 关闭按钮 */}
        <button
          onClick={onClose || onRestart}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="关闭"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div className={`text-7xl font-black ${color} mb-2`}>{grade}</div>
          <div className={`text-xl font-semibold ${color}`}>{label}</div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <ResultStat label="打字速度" value={`${stats.wpm} WPM`} />
          <ResultStat label="准确率" value={`${stats.accuracy}%`} />
          <ResultStat label="最大连击" value={`${stats.maxCombo}`} />
          <ResultStat label="用时" value={`${stats.elapsedSec}秒`} />
          <ResultStat label="正确字符" value={`${stats.correctChars}`} />
          <ResultStat label="错误字符" value={`${stats.errorChars}`} />
        </div>

        {/* Coins earned */}
        {earnedCoins != null && earnedCoins > 0 && (
          <div className="text-center py-2 mb-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <span className="text-yellow-400 font-bold text-lg">🪙 +{earnedCoins} 金币</span>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onRestart}
            className="flex-1 px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg font-medium transition-colors"
          >
            重新开始
          </button>
          <button
            onClick={onNext}
            className="flex-1 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium transition-colors"
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
    <div className="bg-[#1a1918]/60 rounded-lg px-3 py-2">
      <div className="text-xs text-stone-500">{label}</div>
      <div className="text-lg font-semibold text-white">{value}</div>
    </div>
  );
}
