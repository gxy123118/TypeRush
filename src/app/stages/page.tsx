"use client";

import Link from "next/link";
import { useGameStore } from "@/store/gameStore";
import { STAGES, CHAPTERS } from "@/lib/gameData";
import StarRating from "@/components/StarRating";

export default function StagesPage() {
  const { stageStars } = useGameStore();

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-white">🏰 闯关模式</h1>

      {CHAPTERS.map((chapter) => {
        const chapterStages = STAGES.filter((s) => s.chapter === chapter.id);
        const clearedCount = chapterStages.filter((s) => (stageStars[s.id] || 0) > 0).length;
        const totalStars = chapterStages.reduce((sum, s) => sum + (stageStars[s.id] || 0), 0);
        const maxStars = chapterStages.length * 3;

        // Chapter is locked if previous chapter not fully cleared
        const prevChapterStages = chapter.id > 1 ? STAGES.filter((s) => s.chapter === chapter.id - 1) : [];
        const isLocked = chapter.id > 1 && prevChapterStages.some((s) => (stageStars[s.id] || 0) === 0);

        return (
          <div key={chapter.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{chapter.icon}</span>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    第{chapter.id}章：{chapter.title}
                    {isLocked && <span className="ml-2 text-sm text-gray-500">🔒</span>}
                  </h2>
                  <p className="text-sm text-gray-400">{chapter.subtitle}</p>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                ⭐ {totalStars}/{maxStars} · {clearedCount}/{chapterStages.length} 关
              </div>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {chapterStages.map((stage) => {
                const stars = stageStars[stage.id] || 0;
                const prevStage = stage.id > 1 ? stageStars[stage.id - 1] || 0 : 1;
                const stageLocked = isLocked || (stage.id > 1 && prevStage === 0);

                return (
                  <Link
                    key={stage.id}
                    href={stageLocked ? "#" : `/stages/${stage.id}`}
                    className={`relative p-4 rounded-xl border text-center transition-all ${
                      stageLocked
                        ? "border-gray-800 bg-gray-900/50 cursor-not-allowed opacity-40"
                        : stars > 0
                        ? "border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/50"
                        : "border-white/10 bg-gray-800/50 hover:bg-gray-800 hover:border-white/20"
                    }`}
                    onClick={(e) => stageLocked && e.preventDefault()}
                  >
                    <div className="text-2xl font-black text-white mb-1">
                      {stageLocked ? "🔒" : stage.id}
                    </div>
                    <div className="text-xs text-gray-400 mb-2 truncate">{stage.title}</div>
                    <StarRating stars={stars} size="sm" />
                    {stars > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                        <span className="text-[10px] text-white">✓</span>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
