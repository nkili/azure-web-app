import React, { useState } from 'react';
import { useSwissSystem } from '../hooks/useSwissSystem';
import { Task, Match } from '../utils/swiss-system';

export const TaskPrioritizer: React.FC = () => {
  const [taskInput, setTaskInput] = useState('');
  const {
    isSetup,
    isActive,
    isComplete,
    currentRound,
    maxRounds,
    currentMatches,
    tasks,
    finalRankings,
    startSwiss,
    recordMatchWinner,
    nextRound,
    reset,
  } = useSwissSystem();

  const handleStartPrioritization = () => {
    startSwiss(taskInput);
  };

  const handleMatchChoice = (matchId: string, winnerId: string) => {
    recordMatchWinner(matchId, winnerId);
  };

  const isRoundComplete = currentMatches.every(match => match.winner);

  if (isSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Task Prioritizer 🎯
          </h1>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Enter your tasks below (one per line). You can use markdown list format or just plain text.
              The Swiss System will help you prioritize them through head-to-head comparisons.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-blue-800 mb-2">How it works:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Tasks are paired based on similar performance</li>
                <li>• You choose which task is more important in each match</li>
                <li>• Multiple rounds ensure accurate rankings</li>
                <li>• Final ranking considers wins, losses, and opponent strength</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <label htmlFor="tasks" className="block text-sm font-medium text-gray-700">
              Enter your tasks:
            </label>
            <textarea
              id="tasks"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder={`- Complete project proposal
- Review team feedback
- Update documentation
- Schedule client meeting
- Prepare presentation slides`}
              className="w-full h-48 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            
            <button
              onClick={handleStartPrioritization}
              disabled={!taskInput.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-md transition duration-200"
            >
              Start Prioritization
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Task Prioritization</h1>
                <p className="text-gray-600">
                  Round {currentRound} of {maxRounds} • Choose the more important task in each match
                </p>
              </div>
              <button
                onClick={reset}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Current Standings */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Current Standings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {tasks
                .sort((a, b) => {
                  if (a.wins !== b.wins) return b.wins - a.wins;
                  if (a.losses !== b.losses) return a.losses - b.losses;
                  return b.combinedOpponentWins - a.combinedOpponentWins;
                })
                .map((task, index) => (
                  <div key={task.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800 truncate">
                        #{index + 1} {task.name}
                      </span>
                      <span className="text-sm font-semibold text-blue-600">
                        {task.wins}W-{task.losses}L
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Matches */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Round {currentRound} Matches
            </h2>
            
            {currentMatches
              .filter(match => match.taskA.id !== 'bye' && match.taskB.id !== 'bye')
              .map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onChoice={handleMatchChoice}
                />
              ))}

            {currentMatches.filter(match => match.taskA.id === 'bye' || match.taskB.id === 'bye').length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-700 text-sm">
                  ℹ️ Some tasks received a bye (automatic win) this round due to odd number of participants.
                </p>
              </div>
            )}

            {isRoundComplete && (
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Round {currentRound} Complete!
                </h3>
                <button
                  onClick={nextRound}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-md transition duration-200"
                >
                  {currentRound === maxRounds ? 'View Final Rankings' : 'Next Round'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Prioritization Complete! 🏆
              </h1>
              <p className="text-gray-600">
                Here are your tasks ranked by importance based on your choices
              </p>
            </div>

            <div className="space-y-4">
              {finalRankings.map((task, index) => (
                <div
                  key={task.id}
                  className={`
                    rounded-lg p-6 border-l-4 
                    ${index === 0 ? 'bg-yellow-50 border-yellow-400' : 
                      index === 1 ? 'bg-gray-50 border-gray-400' : 
                      index === 2 ? 'bg-orange-50 border-orange-400' : 
                      'bg-white border-blue-200'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center font-bold text-white
                        ${index === 0 ? 'bg-yellow-500' : 
                          index === 1 ? 'bg-gray-500' : 
                          index === 2 ? 'bg-orange-500' : 
                          'bg-blue-500'}
                      `}>
                        #{index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{task.name}</h3>
                        <p className="text-sm text-gray-600">
                          Record: {task.wins} wins, {task.losses} losses
                          {task.combinedOpponentWins > 0 && (
                            <> • Opponent strength: {task.combinedOpponentWins}</>
                          )}
                        </p>
                      </div>
                    </div>
                    {index < 3 && (
                      <div className="text-2xl">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <button
                onClick={reset}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition duration-200"
              >
                Prioritize New Tasks
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

interface MatchCardProps {
  match: Match;
  onChoice: (matchId: string, winnerId: string) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onChoice }) => {
  if (match.winner) {
    const winner = match.taskA.id === match.winner ? match.taskA : match.taskB;
    const loser = match.taskA.id === match.winner ? match.taskB : match.taskA;
    
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-green-200">
        <div className="text-center mb-4">
          <h3 className="font-semibold text-gray-800">Match Complete</h3>
        </div>
        <div className="flex items-center justify-center gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="font-semibold text-green-800">{winner.name}</div>
            <div className="text-sm text-green-600">Winner</div>
          </div>
          <div className="text-2xl text-gray-400">vs</div>
          <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="font-semibold text-gray-600">{loser.name}</div>
            <div className="text-sm text-gray-500">-</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="text-center mb-6">
        <h3 className="font-semibold text-gray-800 mb-2">Which task is more important?</h3>
        <p className="text-sm text-gray-600">Click on the task that has higher priority</p>
      </div>
      
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={() => onChoice(match.id, match.taskA.id)}
          className="flex-1 p-6 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 hover:border-blue-300 rounded-lg transition-all duration-200 text-left"
        >
          <div className="font-semibold text-blue-800">{match.taskA.name}</div>
          <div className="text-sm text-blue-600 mt-1">
            Current: {match.taskA.wins}W-{match.taskA.losses}L
          </div>
        </button>
        
        <div className="text-2xl text-gray-400 font-bold">VS</div>
        
        <button
          onClick={() => onChoice(match.id, match.taskB.id)}
          className="flex-1 p-6 bg-red-50 hover:bg-red-100 border-2 border-red-200 hover:border-red-300 rounded-lg transition-all duration-200 text-left"
        >
          <div className="font-semibold text-red-800">{match.taskB.name}</div>
          <div className="text-sm text-red-600 mt-1">
            Current: {match.taskB.wins}W-{match.taskB.losses}L
          </div>
        </button>
      </div>
    </div>
  );
};
