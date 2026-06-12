"use client";

import { useEffect, useState } from "react";

interface ComboEffectProps {
  combo: number;
}

export default function ComboEffect({ combo }: ComboEffectProps) {
  const [show, setShow] = useState(false);
  const [milestone, setMilestone] = useState(0);

  useEffect(() => {
    if (combo === 10 || combo === 25 || combo === 50 || combo === 100) {
      setMilestone(combo);
      setShow(true);
      const timer = setTimeout(() => setShow(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [combo]);

  if (!show) return null;

  const style =
    milestone >= 100 ? { emoji: "🏆", text: "LEGENDARY!", color: "text-purple-400" }
    : milestone >= 50 ? { emoji: "⚡", text: "UNSTOPPABLE!", color: "text-orange-400" }
    : milestone >= 25 ? { emoji: "🔥", text: "ON FIRE!", color: "text-yellow-400" }
    : { emoji: "✨", text: "NICE COMBO!", color: "text-emerald-400" };

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-combo-pop">
      <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900/90 border border-white/10 ${style.color}`}>
        <span className="text-lg">{style.emoji}</span>
        <span className="text-sm font-black">{style.text}</span>
        <span className="text-xs font-bold opacity-70">{milestone}</span>
      </div>
    </div>
  );
}
