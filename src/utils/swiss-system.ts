export interface Task {
  id: string;
  name: string;
  wins: number;
  losses: number;
  opponents: string[];
  combinedOpponentWins: number;
}

export interface Match {
  id: string;
  taskA: Task;
  taskB: Task;
  round: number;
  winner?: string;
}

export interface SwissRound {
  roundNumber: number;
  matches: Match[];
}

export class SwissSystemManager {
  private tasks: Task[];
  private rounds: SwissRound[];
  private currentRound: number;
  private maxRounds: number;

  constructor(taskNames: string[]) {
    this.tasks = this.initializeTasks(taskNames);
    this.rounds = [];
    this.currentRound = 1;
    this.maxRounds = this.calculateOptimalRounds(taskNames.length);
  }

  private initializeTasks(taskNames: string[]): Task[] {
    const tasks: Task[] = taskNames.map((name, index) => ({
      id: `task-${index}`,
      name: name.trim(),
      wins: 0,
      losses: 0,
      opponents: [],
      combinedOpponentWins: 0,
    }));

    // Add bye tasks if needed (odd number of tasks)
    if (tasks.length % 2 === 1) {
      tasks.push({
        id: 'bye',
        name: 'BYE',
        wins: 0,
        losses: tasks.length, // Bye always loses
        opponents: [],
        combinedOpponentWins: 0,
      });
    }

    return tasks;
  }

  private calculateOptimalRounds(taskCount: number): number {
    // Calculate optimal rounds based on task count
    // Formula: ceil(log2(n)) where n is number of tasks
    return Math.max(3, Math.ceil(Math.log2(taskCount)));
  }

  public generateNextRound(): SwissRound | null {
    if (this.currentRound > this.maxRounds) {
      return null;
    }

    // Sort tasks by current standings for pairing
    const sortedTasks = [...this.tasks].sort((a, b) => {
      // Primary: wins (descending)
      if (a.wins !== b.wins) return b.wins - a.wins;
      // Secondary: losses (ascending)
      if (a.losses !== b.losses) return a.losses - b.losses;
      // Tertiary: combined opponent wins (descending)
      return b.combinedOpponentWins - a.combinedOpponentWins;
    });

    const matches = this.createMatches(sortedTasks);
    const round: SwissRound = {
      roundNumber: this.currentRound,
      matches,
    };

    this.rounds.push(round);
    return round;
  }

  private createMatches(sortedTasks: Task[]): Match[] {
    const matches: Match[] = [];
    const paired = new Set<string>();

    for (let i = 0; i < sortedTasks.length; i++) {
      if (paired.has(sortedTasks[i].id)) continue;

      const taskA = sortedTasks[i];
      let taskB: Task | null = null;

      // Find best opponent (similar score, haven't played before)
      for (let j = i + 1; j < sortedTasks.length; j++) {
        const candidate = sortedTasks[j];

        if (paired.has(candidate.id)) continue;
        if (taskA.opponents.includes(candidate.id)) continue;

        taskB = candidate;
        break;
      }

      // If no valid opponent found, pair with next available
      if (!taskB) {
        for (let j = i + 1; j < sortedTasks.length; j++) {
          const candidate = sortedTasks[j];
          if (!paired.has(candidate.id)) {
            taskB = candidate;
            break;
          }
        }
      }

      if (taskB) {
        const match: Match = {
          id: `match-${this.currentRound}-${matches.length}`,
          taskA,
          taskB,
          round: this.currentRound,
        };

        // Auto-resolve matches against BYE
        if (taskB.id === 'bye') {
          match.winner = taskA.id;
          // Update scores immediately
          taskA.wins++;
          taskB.losses++;
          taskA.opponents.push(taskB.id);
          taskB.opponents.push(taskA.id);
        } else if (taskA.id === 'bye') {
          match.winner = taskB.id;
          // Update scores immediately
          taskB.wins++;
          taskA.losses++;
          taskB.opponents.push(taskA.id);
          taskA.opponents.push(taskB.id);
        }

        matches.push(match);
        paired.add(taskA.id);
        paired.add(taskB.id);
      }
    }

    return matches;
  }

  public recordMatchResult(matchId: string, winnerId: string): void {
    const round = this.rounds.find(r => r.matches.some(m => m.id === matchId));

    if (!round) return;

    const match = round.matches.find(m => m.id === matchId);
    if (!match || match.winner) return;

    match.winner = winnerId;

    const winner = match.taskA.id === winnerId ? match.taskA : match.taskB;
    const loser = match.taskA.id === winnerId ? match.taskB : match.taskA;

    // Update scores
    winner.wins++;
    loser.losses++;

    // Update opponents
    winner.opponents.push(loser.id);
    loser.opponents.push(winner.id);

    // Update combined opponent wins (will be calculated after all matches)
    this.updateCombinedOpponentWins();
  }

  private updateCombinedOpponentWins(): void {
    this.tasks.forEach(task => {
      task.combinedOpponentWins = task.opponents.reduce((sum, opponentId) => {
        const opponent = this.tasks.find(t => t.id === opponentId);
        return sum + (opponent?.wins || 0);
      }, 0);
    });
  }

  public isRoundComplete(): boolean {
    const currentRoundMatches = this.rounds[this.currentRound - 1]?.matches || [];
    return currentRoundMatches.every(match => match.winner);
  }

  public advanceToNextRound(): void {
    if (this.isRoundComplete()) {
      this.currentRound++;
    }
  }

  public isSwissComplete(): boolean {
    return this.currentRound > this.maxRounds;
  }

  public getFinalRankings(): Task[] {
    // Update combined opponent wins before final ranking
    this.updateCombinedOpponentWins();

    return [...this.tasks]
      .filter(task => task.id !== 'bye') // Remove bye task from final rankings
      .sort((a, b) => {
        // Primary: wins (descending)
        if (a.wins !== b.wins) return b.wins - a.wins;
        // Secondary: losses (ascending)
        if (a.losses !== b.losses) return a.losses - b.losses;
        // Tertiary: combined opponent wins (descending)
        return b.combinedOpponentWins - a.combinedOpponentWins;
      });
  }

  public getCurrentRound(): number {
    return this.currentRound;
  }

  public getMaxRounds(): number {
    return this.maxRounds;
  }

  public getRounds(): SwissRound[] {
    return this.rounds;
  }

  public getTasks(): Task[] {
    return this.tasks.filter(task => task.id !== 'bye');
  }

  public getCurrentMatches(): Match[] {
    const currentRoundData = this.rounds[this.currentRound - 1];
    return currentRoundData?.matches || [];
  }
}
