import { useCallback, useState } from 'react';
import { Match, SwissRound, SwissSystemManager, Task } from '../utils/swiss-system';

export interface UseSwissSystemReturn {
  // State
  isSetup: boolean;
  isActive: boolean;
  isComplete: boolean;
  currentRound: number;
  maxRounds: number;
  currentMatches: Match[];
  tasks: Task[];
  rounds: SwissRound[];
  finalRankings: Task[];

  // Actions
  startSwiss: (taskList: string) => void;
  recordMatchWinner: (matchId: string, winnerId: string) => void;
  nextRound: () => void;
  reset: () => void;
}

export function useSwissSystem(): UseSwissSystemReturn {
  const [swissManager, setSwissManager] = useState<SwissSystemManager | null>(null);
  const [isSetup, setIsSetup] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);

  const startSwiss = useCallback((taskList: string) => {
    // Parse task list from markdown-style list
    const tasks = taskList
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        // Remove markdown list markers (-, *, +, numbers)
        return line
          .replace(/^[-*+]\s*/, '')
          .replace(/^\d+\.\s*/, '')
          .trim();
      })
      .filter(task => task.length > 0);

    if (tasks.length < 2) {
      alert('Please enter at least 2 tasks to prioritize.');
      return;
    }

    const manager = new SwissSystemManager(tasks);
    setSwissManager(manager);
    setIsSetup(false);
    setIsActive(true);
    setIsComplete(false);

    // Generate first round
    manager.generateNextRound();
    setForceUpdate(prev => prev + 1);
  }, []);

  const recordMatchWinner = useCallback(
    (matchId: string, winnerId: string) => {
      if (!swissManager) return;

      swissManager.recordMatchResult(matchId, winnerId);
      setForceUpdate(prev => prev + 1); // Force re-render
    },
    [swissManager]
  );

  const nextRound = useCallback(() => {
    if (!swissManager || !swissManager.isRoundComplete()) return;

    swissManager.advanceToNextRound();

    if (swissManager.isSwissComplete()) {
      setIsActive(false);
      setIsComplete(true);
    } else {
      swissManager.generateNextRound();
    }

    setForceUpdate(prev => prev + 1); // Force re-render
  }, [swissManager]);

  const reset = useCallback(() => {
    setSwissManager(null);
    setIsSetup(true);
    setIsActive(false);
    setIsComplete(false);
    setForceUpdate(0);
  }, []);

  return {
    // State
    isSetup,
    isActive,
    isComplete,
    currentRound: swissManager?.getCurrentRound() || 0,
    maxRounds: swissManager?.getMaxRounds() || 0,
    currentMatches: swissManager?.getCurrentMatches() || [],
    tasks: swissManager?.getTasks() || [],
    rounds: swissManager?.getRounds() || [],
    finalRankings: swissManager?.getFinalRankings() || [],

    // Actions
    startSwiss,
    recordMatchWinner,
    nextRound,
    reset,
  };
}
