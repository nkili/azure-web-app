import React, { useEffect, useRef, useState } from 'react';
import { useWritingChallenge } from '../hooks';
import { formatTime } from '../utils';

export const WritingChallenge: React.FC = () => {
  const [timerMinutes, setTimerMinutes] = useState<number>(15);
  const [delaySeconds, setDelaySeconds] = useState<number>(5);
  const [isConfiguring, setIsConfiguring] = useState<boolean>(true);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
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
  } = useWritingChallenge(timerMinutes * 60, delaySeconds);

  useEffect(() => {
    if ((isActive || hasSucceeded) && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isActive, hasSucceeded]);

  const handleStartClick = () => {
    setIsConfiguring(false);
    startChallenge();
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateText(e.target.value);
  };

  const handleReset = () => {
    resetChallenge();
    setIsConfiguring(true);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Text copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (isConfiguring) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Writing Challenge ✍️</h1>

          <div className="space-y-6">
            <div>
              <label htmlFor="timer" className="block text-sm font-medium text-gray-700 mb-2">
                Challenge Duration (minutes)
              </label>
              <input
                id="timer"
                type="number"
                min="1"
                max="120"
                value={timerMinutes}
                onChange={e => setTimerMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="delay" className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Pause (seconds)
              </label>
              <input
                id="delay"
                type="number"
                min="1"
                max="60"
                value={delaySeconds}
                onChange={e => setDelaySeconds(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-md">
              <p className="font-semibold mb-2">Challenge Rules:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Write continuously for {timerMinutes} minutes</li>
                <li>Don't stop typing for more than {delaySeconds} seconds</li>
                <li>If you pause too long, you'll fail the challenge</li>
                <li>Keep your creativity flowing!</li>
              </ul>
            </div>

            <button
              onClick={handleStartClick}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-md transition duration-200"
            >
              Start Challenge
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (hasFailed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-red-600 mb-2">Challenge Failed! 💥</h1>
            <p className="text-gray-600">You stopped writing for too long, but don't give up!</p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Your Writing:</h2>
            <div className="bg-gray-50 border rounded-md p-4 max-h-64 overflow-y-auto">
              <p className="text-gray-700 whitespace-pre-wrap">{text || 'No text written yet.'}</p>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Word count:{' '}
              {
                text
                  .trim()
                  .split(/\s+/)
                  .filter((word: string) => word.length > 0).length
              }
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={copyToClipboard}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-md transition duration-200"
            >
              Copy Text
            </button>
            <button
              onClick={handleReset}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with timer and controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Time Remaining</p>
                <p className="text-2xl font-bold text-green-600">
                  {hasSucceeded ? 'Completed!' : formatTime(timeRemaining)}
                </p>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">Time Until Failure</p>
                <p
                  className={`text-2xl font-bold ${
                    hasSucceeded ? 'text-green-600' : timeUntilFailure <= 2 ? 'text-red-600' : 'text-orange-600'
                  }`}
                >
                  {hasSucceeded ? 'No limit!' : `${timeUntilFailure.toFixed(1)}s`}
                </p>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">Words Written</p>
                <p className="text-2xl font-bold text-blue-600">
                  {
                    text
                      .trim()
                      .split(/\s+/)
                      .filter((word: string) => word.length > 0).length
                  }
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              {isActive ? (
                <button
                  onClick={pauseChallenge}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
                >
                  Pause
                </button>
              ) : isPaused ? (
                <button
                  onClick={resumeChallenge}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
                >
                  Resume
                </button>
              ) : null}

              <button
                onClick={handleReset}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Writing area */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {hasSucceeded
              ? 'Challenge Completed! 🎉 Keep writing freely...'
              : isActive
              ? 'Keep Writing! ✍️'
              : isPaused
              ? 'Paused - Click Resume to Continue'
              : 'Ready to Start'}
          </h2>

          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            disabled={!isActive && !hasSucceeded}
            placeholder={
              isActive
                ? "Start typing and don't stop..."
                : hasSucceeded
                ? 'Continue writing at your own pace...'
                : 'Click start to begin your writing challenge'
            }
            className="w-full h-96 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
          />

          {hasSucceeded && (
            <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-md">
              <div className="flex items-center justify-between">
                <p className="text-green-700 font-semibold">
                  🎉 Congratulations! You completed the {timerMinutes}-minute challenge! Continue writing freely.
                </p>
                <button
                  onClick={copyToClipboard}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
                >
                  Copy Text
                </button>
              </div>
            </div>
          )}

          {timeUntilFailure <= 3 && isActive && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-md">
              <p className="text-red-700 font-semibold">
                ⚠️ Warning: Keep typing or you'll fail in {timeUntilFailure.toFixed(1)} seconds!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
