"use client";

import { useEffect, useState } from "react";

interface ComboEffectProps {
  combo: number;
}

export default function ComboEffect({ combo }: ComboEffectProps) {
  const [showEffect, setShowEffect] = useState(false);
  const [milestone, setMilestone] = useState(0);

  useEffect(() => {
    if (combo === 10 || combo === 25 || combo === 50 || combo === 100) {
      setMilestone(combo);
      setShowEffect(true);
      const timer = setTimeout(() => setShowEffect(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [combo]);

  if (!showEffect) return null;

  const getStyle = () => {
    if (milestone >= 100) return { emoji: "🏆", text: "LEGENDARY!", color: "text-purple-400", bg: "bg-purple-500/20" };
    if (milestone >= 50) return { emoji: "⚡", text: "UNSTOPPABLE!", color: "text-orange-400", bg: "bg-orange-500/20" };
    if (milestone >= 25) return { emoji: "🔥", text: "ON FIRE!", color: "text-yellow-400", bg: "bg-yellow-500/20" };
    return { emoji: "✨", text: "NICE COMBO!", color: "text-emerald-400", bg: "bg-emerald-500/20" };
  };

  const style = getStyle();

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
      <div
        className={`${style.bg} ${style.color} px-8 py-4 rounded-2xl text-center animate-bounce`}
      >
        <div className="text-4xl mb-1">{style.emoji}</div>
        <div className="text-2xl font-black">{style.text}</div>
        <div className="text-lg font-bold">{milestone} COMBO</div>
      </div>
    </div>
  );
}
