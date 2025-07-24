import { useCallback, useEffect, useRef, useState } from 'react';

interface UseWritingChallengeReturn {
  isActive: boolean;
  isPaused: boolean;
  hasStarted: boolean;
  hasFailed: boolean;
  hasSucceeded: boolean;
  text: string;
  timeRemaining: number;
  timeUntilFailure: number;
  startChallenge: () => void;
  pauseChallenge: () => void;
  resumeChallenge: () => void;
  resetChallenge: () => void;
  updateText: (newText: string) => void;
}

export function useWritingChallenge(totalTimeSeconds: number, maxDelaySeconds: number): UseWritingChallengeReturn {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [hasFailed, setHasFailed] = useState<boolean>(false);
  const [hasSucceeded, setHasSucceeded] = useState<boolean>(false);
  const [text, setText] = useState<string>('');
  const [timeRemaining, setTimeRemaining] = useState<number>(totalTimeSeconds);
  const [timeUntilFailure, setTimeUntilFailure] = useState<number>(maxDelaySeconds);

  const lastTypingTimeRef = useRef<number>(Date.now());
  const challengeStartTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);
  const totalPausedDurationRef = useRef<number>(0);

  // Main timer effect
  useEffect(() => {
    if (!isActive || isPaused || hasSucceeded) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedSinceStart = now - challengeStartTimeRef.current - totalPausedDurationRef.current;
      const remaining = Math.max(0, totalTimeSeconds - Math.floor(elapsedSinceStart / 1000));

      setTimeRemaining(remaining);

      // Check if challenge is complete
      if (remaining <= 0) {
        setIsActive(false);
        setHasSucceeded(true);
        setHasFailed(false);
        return;
      }

      // Check typing delay
      const timeSinceLastType = (now - lastTypingTimeRef.current) / 1000;
      const timeLeft = Math.max(0, maxDelaySeconds - timeSinceLastType);

      setTimeUntilFailure(timeLeft);

      // Check if user failed
      if (timeSinceLastType >= maxDelaySeconds) {
        setIsActive(false);
        setHasFailed(true);
      }
    }, 100); // Update every 100ms for smooth countdown

    return () => clearInterval(interval);
  }, [isActive, isPaused, hasSucceeded, totalTimeSeconds, maxDelaySeconds]);

  const startChallenge = useCallback(() => {
    const now = Date.now();
    setIsActive(true);
    setIsPaused(false);
    setHasStarted(true);
    setHasFailed(false);
    setHasSucceeded(false);
    setTimeRemaining(totalTimeSeconds);
    setTimeUntilFailure(maxDelaySeconds);
    challengeStartTimeRef.current = now;
    lastTypingTimeRef.current = now;
    totalPausedDurationRef.current = 0;
  }, [totalTimeSeconds, maxDelaySeconds]);

  const pauseChallenge = useCallback(() => {
    if (isActive) {
      setIsPaused(true);
      setIsActive(false);
      pausedTimeRef.current = Date.now();
    }
  }, [isActive]);

  const resumeChallenge = useCallback(() => {
    if (isPaused) {
      const now = Date.now();
      const pauseDuration = now - pausedTimeRef.current;
      totalPausedDurationRef.current += pauseDuration;

      setIsPaused(false);
      setIsActive(true);
      lastTypingTimeRef.current = now; // Reset typing timer when resuming
    }
  }, [isPaused]);

  const resetChallenge = useCallback(() => {
    setIsActive(false);
    setIsPaused(false);
    setHasStarted(false);
    setHasFailed(false);
    setHasSucceeded(false);
    setText('');
    setTimeRemaining(totalTimeSeconds);
    setTimeUntilFailure(maxDelaySeconds);
    challengeStartTimeRef.current = 0;
    lastTypingTimeRef.current = Date.now();
    pausedTimeRef.current = 0;
    totalPausedDurationRef.current = 0;
  }, [totalTimeSeconds, maxDelaySeconds]);

  const updateText = useCallback(
    (newText: string) => {
      // Only update if text actually changed (new content added)
      if (newText !== text) {
        setText(newText);

        // Only reset typing timer if text is longer (new content added)
        if (newText.length > text.length) {
          lastTypingTimeRef.current = Date.now();
          setTimeUntilFailure(maxDelaySeconds);
        }
      }
    },
    [text, maxDelaySeconds]
  );

  return {
    isActive,
    isPaused,
    hasStarted,
    hasFailed,
    hasSucceeded,
    text,
    timeRemaining,
    timeUntilFailure,
    startChallenge,
    pauseChallenge,
    resumeChallenge,
    resetChallenge,
    updateText,
  };
}
