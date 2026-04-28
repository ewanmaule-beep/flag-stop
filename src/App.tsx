import { useEffect, useMemo, useState } from 'react';
import type { Attempt, Difficulty, Screen } from './types';
import { getDailyPuzzle, getTodayKey } from './lib/dailyPuzzle';
import { getArchivePuzzle } from './lib/archive';
import {
  loadStats,
  saveStats,
  recordResult,
  type Stats,
} from './lib/storage';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';
import ArchiveScreen from './components/ArchiveScreen';
import PrivacyPolicy from './components/PrivacyPolicy';

export default function App() {
  const dateKey = useMemo(() => getTodayKey(), []);
  const dailyPuzzle = useMemo(() => getDailyPuzzle(), []);

  const [stats, setStats] = useState<Stats>(() => loadStats());
  const [screen, setScreen] = useState<Screen>('start');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [activeAttempts, setActiveAttempts] = useState<Attempt[]>([]);
  const [won, setWon] = useState(false);
  const [playerRoute, setPlayerRoute] = useState<string[] | null>(null);
  // null = playing the daily puzzle. A number = playing that archive entry.
  const [archiveNumber, setArchiveNumber] = useState<number | null>(null);

  // The puzzle currently being played: archive entry if one is selected,
  // otherwise today's daily.
  const puzzle = useMemo(
    () =>
      archiveNumber !== null ? getArchivePuzzle(archiveNumber) : dailyPuzzle,
    [archiveNumber, dailyPuzzle]
  );

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
    // Starting today's daily — clear any archive context and reset transient
    // state so the GameScreen mounts fresh.
    setArchiveNumber(null);
    setActiveAttempts([]);
    setWon(false);
    setPlayerRoute(null);
    setScreen('playing');
  }

  function handleStartArchive(num: number) {
    setArchiveNumber(num);
    setActiveAttempts([]);
    setWon(false);
    setPlayerRoute(null);
    setScreen('playing');
  }

  function handleViewResult() {
    if (todayRecord && todayRecord.status !== 'playing') {
      setArchiveNumber(null);
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
    // Archive plays are practice mode — they must NOT touch streaks or stats.
    if (archiveNumber === null) {
      const updated = recordResult(stats, dateKey, didWin, attempts.length, {
        puzzleId: puzzle.id,
        difficulty,
        attempts,
        status: didWin ? 'won' : 'lost',
        playerRoute: fullRoute,
      });
      setStats(updated);
      saveStats(updated);
    }
    setScreen('result');
  }

  function exitGame() {
    // Back arrow during play returns to wherever the player came from.
    setScreen(archiveNumber !== null ? 'archive' : 'start');
  }

  function backToStart() {
    setArchiveNumber(null);
    setScreen('start');
  }

  function backToArchive() {
    setScreen('archive');
  }

  return (
    <div className="min-h-screen w-full">
      {screen === 'start' && (
        <StartScreen
          puzzle={dailyPuzzle}
          difficulty={difficulty}
          onChangeDifficulty={setDifficulty}
          onStart={handleStart}
          alreadyPlayed={alreadyPlayedToday}
          lastResult={lastResult}
          onViewResult={handleViewResult}
          onPrivacy={() => setScreen('privacy')}
          stats={stats}
          onOpenArchive={() => setScreen('archive')}
        />
      )}
      {screen === 'archive' && (
        <ArchiveScreen
          onPick={handleStartArchive}
          onBack={() => setScreen('start')}
        />
      )}
      {screen === 'playing' && (
        <GameScreen
          puzzle={puzzle}
          difficulty={difficulty}
          onExit={exitGame}
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
          isArchive={archiveNumber !== null}
          archiveNumber={archiveNumber ?? undefined}
          onBackToStart={
            archiveNumber !== null ? backToArchive : backToStart
          }
        />
      )}
      {screen === 'privacy' && (
        <PrivacyPolicy onBack={() => setScreen('start')} />
      )}
    </div>
  );
}
