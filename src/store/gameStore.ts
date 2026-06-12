import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface GameState {
  // 货币与等级
  coins: number;
  exp: number;
  level: number;
  // 已解锁成就 ID
  unlockedAchievements: string[];
  // 拥有的物品 ID
  ownedItems: string[];
  // 装备中
  equippedTheme: string;
  equippedEffect: string;
  equippedTitle: string;
  // 音效
  soundEnabled: boolean;
  soundTheme: "mechanical" | "typewriter" | "bubble";
  // 关卡记录：stageId -> best stars
  stageStars: Record<number, number>;
  // 待显示的成就通知队列
  pendingToasts: { id: string; name: string; icon: string; coins: number }[];
  // 待显示的金币动画
  pendingCoinGain: number;

  // Actions
  addCoins: (amount: number) => void;
  addExp: (amount: number) => void;
  unlockAchievement: (id: string, name: string, icon: string, coins: number) => void;
  dismissToast: () => void;
  clearCoinGain: () => void;
  buyItem: (itemId: string, price: number) => boolean;
  equipTheme: (themeId: string) => void;
  equipEffect: (effectId: string) => void;
  equipTitle: (titleId: string) => void;
  recordStage: (stageId: number, stars: number) => void;
  isAchievementUnlocked: (id: string) => boolean;
  ownsItem: (id: string) => boolean;
  toggleSound: () => void;
  setSoundTheme: (theme: "mechanical" | "typewriter" | "bubble") => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      coins: 0,
      exp: 0,
      level: 1,
      unlockedAchievements: [],
      ownedItems: [],
      equippedTheme: "default",
      equippedEffect: "",
      equippedTitle: "",
      soundEnabled: true,
      soundTheme: "mechanical" as const,
      stageStars: {},
      pendingToasts: [],
      pendingCoinGain: 0,

      addCoins: (amount) =>
        set((s) => ({
          coins: s.coins + amount,
          pendingCoinGain: s.pendingCoinGain + amount,
        })),

      addExp: (amount) =>
        set((s) => {
          const newExp = s.exp + amount;
          // Recalculate level
          const thresholds = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500, 6600, 7800, 9100, 10500, 12000, 13600, 15300, 17100, 19000, 21000];
          let newLevel = 1;
          for (let i = thresholds.length - 1; i >= 0; i--) {
            if (newExp >= thresholds[i]) { newLevel = i + 1; break; }
          }
          return { exp: newExp, level: newLevel };
        }),

      unlockAchievement: (id, name, icon, coins) =>
        set((s) => {
          if (s.unlockedAchievements.includes(id)) return s;
          return {
            unlockedAchievements: [...s.unlockedAchievements, id],
            coins: s.coins + coins,
            pendingCoinGain: s.pendingCoinGain + coins,
            pendingToasts: [...s.pendingToasts, { id, name, icon, coins }],
          };
        }),

      dismissToast: () =>
        set((s) => ({ pendingToasts: s.pendingToasts.slice(1) })),

      clearCoinGain: () => set({ pendingCoinGain: 0 }),

      buyItem: (itemId, price) => {
        const s = get();
        if (s.coins < price || s.ownedItems.includes(itemId)) return false;
        set({
          coins: s.coins - price,
          ownedItems: [...s.ownedItems, itemId],
        });
        return true;
      },

      equipTheme: (themeId) => set({ equippedTheme: themeId }),
      equipEffect: (effectId) => set({ equippedEffect: effectId }),
      equipTitle: (titleId) => set({ equippedTitle: titleId }),

      recordStage: (stageId, stars) =>
        set((s) => {
          const current = s.stageStars[stageId] || 0;
          if (stars <= current) return s;
          return { stageStars: { ...s.stageStars, [stageId]: stars } };
        }),

      isAchievementUnlocked: (id) => get().unlockedAchievements.includes(id),
      ownsItem: (id) => get().ownedItems.includes(id),
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      setSoundTheme: (theme) => set({ soundTheme: theme }),
    }),
    { name: "typerush-game" }
  )
);

// 初始状态，用于 reset
const initialState = {
  coins: 0,
  exp: 0,
  level: 1,
  unlockedAchievements: [] as string[],
  ownedItems: [] as string[],
  equippedTheme: "default",
  equippedEffect: "",
  equippedTitle: "",
  soundEnabled: true,
  soundTheme: "mechanical" as const,
  stageStars: {} as Record<number, number>,
  pendingToasts: [] as { id: string; name: string; icon: string; coins: number }[],
  pendingCoinGain: 0,
};

/**
 * 切换用户时调用：把当前用户数据存到 localStorage，加载新用户数据
 */
export function switchGameUser(userId: string | null) {
  const store = useGameStore.getState();

  // 保存当前用户数据（如果有 key）
  const currentKey = localStorage.getItem("typerush-game-user");
  if (currentKey) {
    const { pendingToasts: _, pendingCoinGain: __, ...data } = store;
    localStorage.setItem(`typerush-game-${currentKey}`, JSON.stringify(data));
  }

  if (userId) {
    // 加载新用户数据
    localStorage.setItem("typerush-game-user", userId);
    const saved = localStorage.getItem(`typerush-game-${userId}`);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        useGameStore.setState({ ...initialState, ...data, pendingToasts: [], pendingCoinGain: 0 });
      } catch {
        useGameStore.setState(initialState);
      }
    } else {
      useGameStore.setState(initialState);
    }
  } else {
    // 退出登录
    localStorage.removeItem("typerush-game-user");
    useGameStore.setState(initialState);
  }
}
