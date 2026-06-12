import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ContentType, Difficulty } from "@/lib/content";

export interface PracticeRecord {
  id: string;
  wpm: number;
  accuracy: number;
  maxCombo: number;
  durationSec: number;
  contentType: ContentType;
  difficulty: Difficulty;
  mode: string;
  createdAt: string;
}

interface TypingState {
  records: PracticeRecord[];
  bestWpm: number;
  totalPractices: number;
  addRecord: (record: Omit<PracticeRecord, "id" | "createdAt">) => void;
  getRecentRecords: (limit?: number) => PracticeRecord[];
}

export const useTypingStore = create<TypingState>()(
  persist(
    (set, get) => ({
      records: [],
      bestWpm: 0,
      totalPractices: 0,

      addRecord: (record) => {
        const newRecord: PracticeRecord = {
          ...record,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          records: [newRecord, ...state.records],
          bestWpm: Math.max(state.bestWpm, record.wpm),
          totalPractices: state.totalPractices + 1,
        }));
      },

      getRecentRecords: (limit = 20) => {
        return get().records.slice(0, limit);
      },
    }),
    {
      name: "typerush-storage",
    }
  )
);
