"use client";

import type { ContentType, Difficulty } from "@/lib/content";

interface ContentSelectorProps {
  contentType: ContentType;
  difficulty: Difficulty;
  onTypeChange: (type: ContentType) => void;
  onDifficultyChange: (diff: Difficulty) => void;
}

const typeOptions: { value: ContentType; label: string; icon: string }[] = [
  { value: "english", label: "英文", icon: "🔤" },
  { value: "chinese", label: "中文", icon: "🀄" },
  { value: "code", label: "代码", icon: "💻" },
];

const difficultyOptions: { value: Difficulty; label: string; color: string }[] = [
  { value: "easy", label: "简单", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
  { value: "medium", label: "中等", color: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10" },
  { value: "hard", label: "困难", color: "text-red-400 border-red-500/30 bg-red-500/10" },
];

export default function ContentSelector({
  contentType,
  difficulty,
  onTypeChange,
  onDifficultyChange,
}: ContentSelectorProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 uppercase tracking-wider">类型</span>
        <div className="flex gap-1">
          {typeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onTypeChange(opt.value)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                contentType === opt.value
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              {opt.icon} {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 uppercase tracking-wider">难度</span>
        <div className="flex gap-1">
          {difficultyOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onDifficultyChange(opt.value)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-all ${
                difficulty === opt.value
                  ? opt.color
                  : "border-transparent bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
