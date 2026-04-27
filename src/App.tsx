import { useEffect, useMemo, useState } from 'react';
import type { Attempt, Difficulty, Screen } from './types';
import { getDailyPuzzle, getTodayKey } from './lib/dailyPuzzle';
import {
  loadStats,
  saveStats,
  recordResult,
  type Stats,
} from './lib/storage';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';

export default function App() {
  const dateKey = useMemo(() => getTodayKey(), []);
  const puzzle = useMemo(() => getDailyPuzzle(), []);

  const [stats, setStats] = useState<Stats>(() => loadStats());
  const [screen, setScreen] = useState<Screen>('start');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [activeAttempts, setActiveAttempts] = useState<Attempt[]>([]);
  const [won, setWon] = useState(false);
  const [playerRoute, setPlayerRoute] = useState<string[] | null>(null);

  // If today is already completed, restore that state on first load.
  useEffect(() => {
    const today = stats.history[dateKey];
    if (today && today.status !== 'playing') {
      setActiveAttempts(today.attempts);
      setWon(today.status === 'won');
      setDifficulty(today.difficulty);
      setPlayerRoute(today.playerRoute ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const todayRecord = stats.history[dateKey];
  const alreadyPlayedToday =
    todayRecord !== undefined && todayRecord.status !== 'playing';
  const lastResult: 'won' | 'lost' | null = alreadyPlayedToday
    ? todayRecord.status === 'won'
      ? 'won'
      : 'lost'
    : null;

  function handleStart() {
    setScreen('playing');
  }

  function handleViewResult() {
    if (todayRecord && todayRecord.status !== 'playing') {
      setActiveAttempts(todayRecord.attempts);
      setWon(todayRecord.status === 'won');
      setDifficulty(todayRecord.difficulty);
      setPlayerRoute(todayRecord.playerRoute ?? null);
      setScreen('result');
    }
  }

  function handleComplete(
    didWin: boolean,
    attempts: Attempt[],
    fullRoute: string[] | null
  ) {
    setActiveAttempts(attempts);
    setWon(didWin);
    setPlayerRoute(fullRoute);
    const updated = recordResult(stats, dateKey, didWin, attempts.length, {
      puzzleId: puzzle.id,
      difficulty,
      attempts,
      status: didWin ? 'won' : 'lost',
      playerRoute: fullRoute,
    });
    setStats(updated);
    saveStats(updated);
    setScreen('result');
  }

  function backToStart() {
    setScreen('start');
  }

  return (
    <div className="min-h-screen w-full">
      {screen === 'start' && (
        <StartScreen
          puzzle={puzzle}
          difficulty={difficulty}
          onChangeDifficulty={setDifficulty}
          onStart={handleStart}
          alreadyPlayed={alreadyPlayedToday}
          lastResult={lastResult}
          onViewResult={handleViewResult}
        />
      )}
      {screen === 'playing' && (
        <GameScreen
          puzzle={puzzle}
          difficulty={difficulty}
          onExit={backToStart}
          onComplete={handleComplete}
        />
      )}
      {screen === 'result' && (
        <ResultScreen
          puzzle={puzzle}
          difficulty={difficulty}
          attempts={activeAttempts}
          won={won}
          playerRoute={playerRoute}
          dateKey={dateKey}
          stats={stats}
          onBackToStart={backToStart}
        />
      )}
    </div>
  );
}
