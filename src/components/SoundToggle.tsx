"use client";

import { useGameStore } from "@/store/gameStore";

export default function SoundToggle() {
  const { soundEnabled, toggleSound } = useGameStore();

  return (
    <button
      onClick={toggleSound}
      className="w-8 h-8 flex items-center justify-center rounded-md text-stone-400 hover:text-white hover:bg-white/[0.04] transition-colors"
      title={soundEnabled ? "关闭音效" : "开启音效"}
    >
      {soundEnabled ? "🔊" : "🔇"}
    </button>
  );
}
