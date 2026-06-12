"use client";

import { useEffect, useRef } from "react";

interface TypingAreaProps {
  charStates: { char: string; status: "pending" | "correct" | "incorrect" }[];
  currentIndex: number;
  onKeyPress: (key: string) => void;
  isCode?: boolean;
}

export default function TypingArea({
  charStates,
  currentIndex,
  onKeyPress,
  isCode = false,
}: TypingAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  // Auto-scroll to keep cursor visible
  useEffect(() => {
    if (cursorRef.current) {
      cursorRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [currentIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.preventDefault();
    onKeyPress(e.key);
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`relative p-6 rounded-xl border border-white/[0.06] bg-[#1a1918]/60 focus:outline-none focus:ring-2 focus:ring-amber-500/40 cursor-text min-h-[160px] max-h-[320px] overflow-y-auto ${
        isCode ? "font-mono text-sm leading-relaxed whitespace-pre" : "font-sans text-lg leading-relaxed"
      }`}
    >
      {charStates.length === 0 ? (
        <p className="text-gray-500 italic">点击此处开始打字...</p>
      ) : (
        <p className={isCode ? "whitespace-pre-wrap break-all" : "break-words"}>
          {charStates.map((cs, i) => {
            const isCursor = i === currentIndex;
            return (
              <span
                key={i}
                ref={isCursor ? cursorRef : undefined}
                className={`${
                  cs.status === "correct"
                    ? "text-amber-300"
                    : cs.status === "incorrect"
                    ? "text-rose-400 bg-rose-400/15"
                    : "text-stone-500"
                } ${isCursor ? "border-l-2 border-amber-400 animate-pulse" : ""}`}
              >
                {cs.char === "\n" ? "↵\n" : cs.char}
              </span>
            );
          })}
        </p>
      )}
      {charStates.length > 0 && currentIndex === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-gray-600 text-sm animate-pulse">
            开始打字吧...
          </span>
        </div>
      )}
    </div>
  );
}
