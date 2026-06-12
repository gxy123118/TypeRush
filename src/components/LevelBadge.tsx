"use client";

import { getRank, getExpProgress } from "@/lib/gameData";

interface LevelBadgeProps {
  level: number;
  exp: number;
  size?: "sm" | "md" | "lg";
  showProgress?: boolean;
}

export default function LevelBadge({ level, exp, size = "md", showProgress = false }: LevelBadgeProps) {
  const rank = getRank(level);
  const progress = getExpProgress(exp);

  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-sm px-2 py-1",
    lg: "text-base px-3 py-1.5",
  };

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <span className={`inline-flex items-center gap-1 rounded-full font-bold ${rank.bgColor} ${rank.color} ${sizeClasses[size]}`}>
        <span>{rank.icon}</span>
        <span>{rank.name} {rank.tier}</span>
        <span className="opacity-60">Lv.{level}</span>
      </span>
      {showProgress && (
        <div className="w-full max-w-[120px]">
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${rank.color.replace("text-", "bg-")}`}
              style={{ width: `${progress.progress}%` }}
            />
          </div>
          <div className="text-[10px] text-gray-500 text-center mt-0.5">
            {progress.current}/{progress.next}
          </div>
        </div>
      )}
    </div>
  );
}
