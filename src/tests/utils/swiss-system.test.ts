import { SwissSystemManager } from '../../utils/swiss-system';

describe('SwissSystemManager', () => {
  test('should initialize correctly with 4 tasks', () => {
    const tasks = ['Task A', 'Task B', 'Task C', 'Task D'];
    const manager = new SwissSystemManager(tasks);
    
    expect(manager.getTasks()).toHaveLength(4);
    expect(manager.getCurrentRound()).toBe(1);
    expect(manager.getMaxRounds()).toBe(3); // ceil(log2(4)) = 2, but min 3
  });

  test('should initialize correctly with 5 tasks (odd number)', () => {
    const tasks = ['Task A', 'Task B', 'Task C', 'Task D', 'Task E'];
    const manager = new SwissSystemManager(tasks);
    
    expect(manager.getTasks()).toHaveLength(5); // Should not include BYE in getTasks()
    expect(manager.getCurrentRound()).toBe(1);
  });

  test('should generate first round matches', () => {
    const tasks = ['Task A', 'Task B', 'Task C', 'Task D'];
    const manager = new SwissSystemManager(tasks);
    
    const round = manager.generateNextRound();
    expect(round).not.toBeNull();
    expect(round!.matches).toHaveLength(2); // 4 tasks = 2 matches
    expect(round!.roundNumber).toBe(1);
  });

  test('should handle matches against BYE automatically', () => {
    const tasks = ['Task A', 'Task B', 'Task C']; // Odd number
    const manager = new SwissSystemManager(tasks);
    
    const round = manager.generateNextRound();
    expect(round).not.toBeNull();
    expect(round!.matches).toHaveLength(2); // 3 tasks + 1 BYE = 2 matches
    
    // Find the BYE match
    const byeMatch = round!.matches.find(match => 
      match.taskA.id === 'bye' || match.taskB.id === 'bye'
    );
    expect(byeMatch).toBeTruthy();
    expect(byeMatch!.winner).toBeTruthy(); // Should be auto-resolved
  });

  test('should record match results correctly', () => {
    const tasks = ['Task A', 'Task B', 'Task C', 'Task D'];
    const manager = new SwissSystemManager(tasks);
    
    const round = manager.generateNextRound();
    const match = round!.matches[0];
    
    // Record a winner
    manager.recordMatchResult(match.id, match.taskA.id);
    
    expect(match.winner).toBe(match.taskA.id);
    expect(match.taskA.wins).toBe(1);
    expect(match.taskB.losses).toBe(1);
    expect(match.taskA.opponents).toContain(match.taskB.id);
    expect(match.taskB.opponents).toContain(match.taskA.id);
  });

  test('should determine round completion correctly', () => {
    const tasks = ['Task A', 'Task B', 'Task C', 'Task D'];
    const manager = new SwissSystemManager(tasks);
    
    manager.generateNextRound();
    expect(manager.isRoundComplete()).toBe(false);
    
    // Complete all matches
    const matches = manager.getCurrentMatches();
    matches.forEach(match => {
      if (!match.winner) {
        manager.recordMatchResult(match.id, match.taskA.id);
      }
    });
    
    expect(manager.isRoundComplete()).toBe(true);
  });

  test('should advance to next round correctly', () => {
    const tasks = ['Task A', 'Task B', 'Task C', 'Task D'];
    const manager = new SwissSystemManager(tasks);
    
    // Complete round 1
    manager.generateNextRound();
    const matches = manager.getCurrentMatches();
    matches.forEach(match => {
      if (!match.winner) {
        manager.recordMatchResult(match.id, match.taskA.id);
      }
    });
    
    expect(manager.getCurrentRound()).toBe(1);
    manager.advanceToNextRound();
    expect(manager.getCurrentRound()).toBe(2);
  });

  test('should provide final rankings', () => {
    const tasks = ['Task A', 'Task B', 'Task C', 'Task D'];
    const manager = new SwissSystemManager(tasks);
    
    // Simulate some rounds
    for (let round = 1; round <= 3; round++) {
      manager.generateNextRound();
      const matches = manager.getCurrentMatches();
      matches.forEach(match => {
        if (!match.winner) {
          manager.recordMatchResult(match.id, match.taskA.id);
        }
      });
      if (!manager.isSwissComplete()) {
        manager.advanceToNextRound();
      }
    }
    
    const rankings = manager.getFinalRankings();
    expect(rankings).toHaveLength(4);
    expect(rankings[0].wins).toBeGreaterThanOrEqual(rankings[1].wins);
  });
});
