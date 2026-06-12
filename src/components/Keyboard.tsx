"use client";

import { useMemo } from "react";

// Standard QWERTY layout
const ROWS = [
  [
    { key: "`", w: 1 }, { key: "1", w: 1 }, { key: "2", w: 1 }, { key: "3", w: 1 },
    { key: "4", w: 1 }, { key: "5", w: 1 }, { key: "6", w: 1 }, { key: "7", w: 1 },
    { key: "8", w: 1 }, { key: "9", w: 1 }, { key: "0", w: 1 }, { key: "-", w: 1 },
    { key: "=", w: 1 }, { key: "⌫", w: 2 },
  ],
  [
    { key: "Tab", w: 1.5 }, { key: "Q", w: 1 }, { key: "W", w: 1 }, { key: "E", w: 1 },
    { key: "R", w: 1 }, { key: "T", w: 1 }, { key: "Y", w: 1 }, { key: "U", w: 1 },
    { key: "I", w: 1 }, { key: "O", w: 1 }, { key: "P", w: 1 }, { key: "[", w: 1 },
    { key: "]", w: 1 }, { key: "\\", w: 1.5 },
  ],
  [
    { key: "Caps", w: 1.75 }, { key: "A", w: 1 }, { key: "S", w: 1 }, { key: "D", w: 1 },
    { key: "F", w: 1 }, { key: "G", w: 1 }, { key: "H", w: 1 }, { key: "J", w: 1 },
    { key: "K", w: 1 }, { key: "L", w: 1 }, { key: ";", w: 1 }, { key: "'", w: 1 },
    { key: "Enter", w: 2.25 },
  ],
  [
    { key: "Shift", w: 2.25 }, { key: "Z", w: 1 }, { key: "X", w: 1 }, { key: "C", w: 1 },
    { key: "V", w: 1 }, { key: "B", w: 1 }, { key: "N", w: 1 }, { key: "M", w: 1 },
    { key: ",", w: 1 }, { key: ".", w: 1 }, { key: "/", w: 1 }, { key: "Shift", w: 2.75 },
  ],
  [
    { key: "Ctrl", w: 1.5 }, { key: "Alt", w: 1.25 }, { key: "Cmd", w: 1.25 },
    { key: " ", w: 6 },
    { key: "Cmd", w: 1.25 }, { key: "Alt", w: 1.25 }, { key: "Ctrl", w: 1.5 },
  ],
];

// Finger color zones (0-based from left pinky to right pinky)
const FINGER_COLORS: Record<string, string> = {
  // Left pinky
  "`": "#ef4444", "1": "#ef4444", "Q": "#ef4444", "A": "#ef4444", "Z": "#ef4444",
  "Tab": "#ef4444", "Caps": "#ef4444", "Shift": "#ef4444",
  // Left ring
  "2": "#f97316", "W": "#f97316", "S": "#f97316", "X": "#f97316",
  // Left middle
  "3": "#eab308", "E": "#eab308", "D": "#eab308", "C": "#eab308",
  // Left index
  "4": "#22c55e", "R": "#22c55e", "F": "#22c55e", "V": "#22c55e",
  "5": "#22c55e", "T": "#22c55e", "G": "#22c55e", "B": "#22c55e",
  // Right index
  "6": "#06b6d4", "Y": "#06b6d4", "H": "#06b6d4", "N": "#06b6d4",
  "7": "#06b6d4", "U": "#06b6d4", "J": "#06b6d4", "M": "#06b6d4",
  // Right middle
  "8": "#3b82f6", "I": "#3b82f6", "K": "#3b82f6", ",": "#3b82f6",
  // Right ring
  "9": "#8b5cf6", "O": "#8b5cf6", "L": "#8b5cf6", ".": "#8b5cf6",
  // Right pinky
  "0": "#ec4899", "P": "#ec4899", ";": "#ec4899", "/": "#ec4899",
  "-": "#ec4899", "[": "#ec4899", "'": "#ec4899",
  "=": "#ec4899", "]": "#ec4899", "Enter": "#ec4899",
  "\\": "#ec4899", "⌫": "#ec4899",
};

export function getFingerForKey(key: string): string {
  return FINGER_COLORS[key.toUpperCase()] || FINGER_COLORS[key] || "#6b7280";
}

interface KeyboardProps {
  activeKey?: string;
  highlightFinger?: boolean;
}

export default function Keyboard({ activeKey = "", highlightFinger = false }: KeyboardProps) {
  const normalizedKey = useMemo(() => {
    if (activeKey === " ") return " ";
    if (activeKey === "Backspace") return "⌫";
    return activeKey.toUpperCase();
  }, [activeKey]);

  const UNIT = 44;
  const GAP = 4;
  const PADDING = 8;
  const totalWidth = 15 * UNIT + 14 * GAP + PADDING * 2;

  let y = PADDING;

  return (
    <svg
      viewBox={`0 0 ${totalWidth} ${5 * UNIT + 4 * GAP + PADDING * 2}`}
      className="w-full max-w-3xl mx-auto"
      role="img"
      aria-label="Virtual keyboard"
    >
      {ROWS.map((row, ri) => {
        let x = PADDING;
        const keys = row.map((k, ki) => {
          const w = k.w * UNIT + (k.w - 1) * GAP;
          const isActive = normalizedKey === k.key.toUpperCase() || normalizedKey === k.key;
          const fingerColor = FINGER_COLORS[k.key.toUpperCase()] || FINGER_COLORS[k.key] || "#6b7280";

          const el = (
            <g key={`${ri}-${ki}`}>
              <rect
                x={x}
                y={y}
                width={w}
                height={UNIT}
                rx={6}
                fill={isActive ? fingerColor : highlightFinger ? `${fingerColor}22` : "#1f2937"}
                stroke={isActive ? fingerColor : "#374151"}
                strokeWidth={isActive ? 2 : 1}
                opacity={isActive ? 1 : 0.9}
              />
              <text
                x={x + w / 2}
                y={y + UNIT / 2 + 1}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isActive ? "#fff" : "#9ca3af"}
                fontSize={k.key.length > 1 ? 9 : 13}
                fontFamily="system-ui, sans-serif"
                fontWeight={isActive ? "bold" : "normal"}
              >
                {k.key === " " ? "Space" : k.key}
              </text>
            </g>
          );
          x += w + GAP;
          return el;
        });
        y += UNIT + GAP;
        return keys;
      })}
    </svg>
  );
}
