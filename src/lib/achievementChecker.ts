import { ACHIEVEMENTS } from "@/lib/gameData";
import type { GameState } from "@/store/gameStore";

interface PracticeResult {
  wpm: number;
  accuracy: number;
  maxCombo: number;
  totalChars: number;
}

/**
 * Check which achievements should be unlocked after a practice/stage completion.
 * Returns newly unlocked achievement IDs.
 */
export function checkAchievements(
  result: PracticeResult,
  totalPractices: number,
  stageStars: Record<number, number>,
  unlockedAchievements: string[],
  recentAccuracies: number[],
): string[] {
  const newlyUnlocked: string[] = [];

  function check(id: string, condition: boolean) {
    if (!unlockedAchievements.includes(id) && condition) {
      newlyUnlocked.push(id);
    }
  }

  // Speed
  check("speed-1", result.wpm >= 20);
  check("speed-2", result.wpm >= 40);
  check("speed-3", result.wpm >= 60);
  check("speed-4", result.wpm >= 80);
  check("speed-5", result.wpm >= 100);

  // Accuracy
  check("acc-1", result.accuracy >= 90);
  check("acc-2", result.accuracy >= 95);
  check("acc-3", result.accuracy >= 100 && result.totalChars >= 20);
  // Check last 5 accuracies (including current)
  const last5 = [...recentAccuracies.slice(-4), result.accuracy];
  check("acc-4", last5.length >= 5 && last5.every((a) => a >= 95));

  // Combo
  check("combo-1", result.maxCombo >= 10);
  check("combo-2", result.maxCombo >= 25);
  check("combo-3", result.maxCombo >= 50);
  check("combo-4", result.maxCombo >= 100);

  // Persistence (totalPractices is count AFTER this practice)
  check("persist-1", totalPractices >= 1);
  check("persist-2", totalPractices >= 10);
  check("persist-3", totalPractices >= 50);
  check("persist-4", totalPractices >= 100);
  check("persist-5", totalPractices >= 500);

  // Stage achievements
  const clearedStages = Object.keys(stageStars).filter((k) => stageStars[Number(k)] > 0).length;
  check("stage-1", clearedStages >= 5);
  check("stage-2", clearedStages >= 10);
  check("stage-3", clearedStages >= 15);
  check("stage-5", clearedStages >= 20);
  // All stages 3-star
  const allThreeStar = Object.keys(stageStars).length >= 20 && Object.values(stageStars).every((s) => s >= 3);
  check("stage-4", allThreeStar);

  return newlyUnlocked;
}

/**
 * Trigger achievement unlock in the game store
 */
export function triggerAchievements(
  newIds: string[],
  unlock: GameState["unlockAchievement"]
) {
  for (const id of newIds) {
    const achievement = ACHIEVEMENTS.find((a) => a.id === id);
    if (achievement) {
      unlock(achievement.id, achievement.name, achievement.icon, achievement.coins);
    }
  }
}
