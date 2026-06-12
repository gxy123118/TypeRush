import { useEffect, useRef } from "react";
import { useGameStore } from "@/store/gameStore";
import { playKeySound, playCombo, playComplete } from "@/lib/soundEngine";

/**
 * Hook that plays sound effects based on typing state changes.
 * Call this in any typing page component.
 */
export function useTypingSound(
  lastCorrect: boolean | null,
  combo: number,
  isComplete: boolean,
) {
  const soundEnabled = useGameStore((s) => s.soundEnabled);
  const soundTheme = useGameStore((s) => s.soundTheme);
  const prevComboRef = useRef(combo);
  const completedRef = useRef(false);

  // Key press sound
  useEffect(() => {
    if (!soundEnabled || lastCorrect === null) return;
    playKeySound(lastCorrect, soundTheme);
  }, [lastCorrect, soundEnabled, soundTheme]);

  // Combo milestone sound
  useEffect(() => {
    if (!soundEnabled) return;
    if (
      combo !== prevComboRef.current &&
      (combo === 10 || combo === 25 || combo === 50 || combo === 100)
    ) {
      playCombo();
    }
    prevComboRef.current = combo;
  }, [combo, soundEnabled]);

  // Complete sound
  useEffect(() => {
    if (!soundEnabled) return;
    if (isComplete && !completedRef.current) {
      completedRef.current = true;
      playComplete();
    }
    if (!isComplete) {
      completedRef.current = false;
    }
  }, [isComplete, soundEnabled]);
}
