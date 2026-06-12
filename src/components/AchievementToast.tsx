"use client";

import { useEffect, useState, useCallback } from "react";
import { useGameStore } from "@/store/gameStore";

export default function AchievementToast() {
  const { pendingToasts, dismissToast } = useGameStore();
  const [visible, setVisible] = useState(false);

  const toast = pendingToasts[0];

  const dismiss = useCallback(() => {
    setVisible(false);
    setTimeout(dismissToast, 300);
  }, [dismissToast]);

  useEffect(() => {
    if (toast) {
      // 延迟一点再弹出，避免和结算卡片同时出现
      const showTimer = setTimeout(() => setVisible(true), 800);
      const hideTimer = setTimeout(() => dismiss(), 5000);
      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    } else {
      setVisible(false);
    }
  }, [toast, dismiss]);

  if (!toast) return null;

  return (
    <div
      className={`fixed top-16 left-1/2 z-[70] -translate-x-1/2 transition-all duration-300 ease-out ${
        visible
          ? "translate-y-2 opacity-100"
          : "-translate-y-6 opacity-0 pointer-events-none"
      }`}
    >
      <div
        className="bg-gray-900 border-2 border-yellow-500/50 rounded-2xl px-6 py-5 shadow-lg shadow-yellow-500/10 min-w-[300px] cursor-pointer"
        onClick={dismiss}
      >
        {/* 顶部标签 */}
        <div className="text-center text-[10px] font-black text-yellow-400 uppercase tracking-[0.2em] mb-3">
          🎉 成就解锁
        </div>

        {/* 图标 + 名称 */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="text-4xl achievement-icon-bounce">{toast.icon}</span>
          <span className="text-xl font-black text-white">{toast.name}</span>
        </div>

        {/* 奖励金币 */}
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-1.5 text-yellow-400 font-bold text-sm">
            🪙 +{toast.coins} 金币
          </span>
        </div>
      </div>
    </div>
  );
}
