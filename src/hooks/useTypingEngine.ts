import { useState, useCallback, useRef, useEffect } from "react";

export interface TypingStats {
  wpm: number;
  accuracy: number;
  combo: number;
  maxCombo: number;
  correctChars: number;
  totalChars: number;
  errorChars: number;
  elapsedSec: number;
  isComplete: boolean;
}

interface CharState {
  char: string;
  status: "pending" | "correct" | "incorrect";
}

export function useTypingEngine(text: string) {
  const [charStates, setCharStates] = useState<CharState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [errorChars, setErrorChars] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [lastKey, setLastKey] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize char states when text changes
  useEffect(() => {
    setCharStates(
      text.split("").map((char) => ({ char, status: "pending" as const }))
    );
    setCurrentIndex(0);
    setCombo(0);
    setMaxCombo(0);
    setCorrectChars(0);
    setErrorChars(0);
    setStartTime(null);
    setElapsedSec(0);
    setIsComplete(false);
    setLastKey("");
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [text]);

  // Timer
  useEffect(() => {
    if (startTime && !isComplete) {
      timerRef.current = setInterval(() => {
        setElapsedSec(Math.floor((Date.now() - startTime) / 1000));
      }, 200);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime, isComplete]);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (isComplete) return;

      // Start timer on first keypress
      if (startTime === null) {
        setStartTime(Date.now());
      }

      setLastKey(key);

      // Handle backspace
      if (key === "Backspace") {
        if (currentIndex > 0) {
          const newIndex = currentIndex - 1;
          setCurrentIndex(newIndex);
          setCharStates((prev) => {
            const next = [...prev];
            if (next[newIndex].status === "incorrect") {
              setErrorChars((e) => Math.max(0, e - 1));
            } else if (next[newIndex].status === "correct") {
              setCorrectChars((c) => Math.max(0, c - 1));
            }
            next[newIndex] = { ...next[newIndex], status: "pending" };
            return next;
          });
          setCombo(0);
        }
        return;
      }

      // Map Enter to newline, Tab to tab
      let inputChar = key;
      if (key === "Enter") inputChar = "\n";
      else if (key === "Tab") inputChar = "\t";

      // Skip non-printable keys
      if (inputChar.length !== 1) return;

      if (currentIndex >= text.length) return;

      const isCorrect = inputChar === text[currentIndex];

      setCharStates((prev) => {
        const next = [...prev];
        next[currentIndex] = {
          ...next[currentIndex],
          status: isCorrect ? "correct" : "incorrect",
        };
        return next;
      });

      if (isCorrect) {
        setCorrectChars((c) => c + 1);
        setCombo((c) => {
          const newCombo = c + 1;
          setMaxCombo((m) => Math.max(m, newCombo));
          return newCombo;
        });
      } else {
        setErrorChars((e) => e + 1);
        setCombo(0);
      }

      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);

      // Check completion
      if (newIndex >= text.length) {
        setIsComplete(true);
        if (startTime) {
          setElapsedSec(Math.floor((Date.now() - startTime) / 1000));
        }
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    },
    [currentIndex, isComplete, startTime, text]
  );

  const totalTyped = correctChars + errorChars;
  const minutes = elapsedSec / 60;
  const wpm = minutes > 0 ? Math.round(correctChars / 5 / minutes) : 0;
  const accuracy = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 100;

  const reset = useCallback(() => {
    setCharStates(
      text.split("").map((char) => ({ char, status: "pending" as const }))
    );
    setCurrentIndex(0);
    setCombo(0);
    setMaxCombo(0);
    setCorrectChars(0);
    setErrorChars(0);
    setStartTime(null);
    setElapsedSec(0);
    setIsComplete(false);
    setLastKey("");
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [text]);

  const stats: TypingStats = {
    wpm,
    accuracy,
    combo,
    maxCombo,
    correctChars,
    totalChars: totalTyped,
    errorChars,
    elapsedSec,
    isComplete,
  };

  return {
    charStates,
    currentIndex,
    stats,
    lastKey,
    handleKeyPress,
    reset,
  };
}
