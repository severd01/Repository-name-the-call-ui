"use client";

import { useMemo, useState } from "react";
import puzzles from "../data/puzzles.json";

type Screen =
  | "home"
  | "scenario"
  | "investigate1"
  | "investigate2"
  | "decision"
  | "reveal";

type ClueType = "Helpful" | "Neutral" | "Misleading";

type Round1Clue = {
  title: string;
  type?: ClueType;
  result: string;
};

type Round2Clue = {
  title: string;
  type?: ClueType;
  result:
    | string
    | {
        default: string;
        biased: string;
      };
};

type Decision = {
  id: string;
  text: string;
};

type Puzzle = {
  id: number;
  title: string;
  role: string;
  difficulty: string;
  scenario: string;
  image?: string;
  cluesRound1: Round1Clue[];
  cluesRound2: Round2Clue[];
  decisions: Decision[];
  correct: string;
  expertAction: string;
  expertExplanation: string;
  lesson: string;
  outcomes: Record<string, string>;
};

const typedPuzzles = puzzles as Puzzle[];

function getScore(isCorrect: boolean, cluesUsed: number) {
  if (!isCorrect) return 0;
  if (cluesUsed === 0) return 100;
  if (cluesUsed === 1) return 70;
  return 40;
}

function getScoreLabel(isCorrect: boolean, cluesUsed: number) {
  if (!isCorrect) return "Missed Call";
  if (cluesUsed === 0) return "Perfect Call";
  if (cluesUsed === 1) return "Strong Call";
  return "Safe Call";
}

function getBadgeClasses(label: string) {
  if (label === "Perfect Call") {
    return "bg-green-100 text-green-800 border-green-200";
  }
  if (label === "Strong Call") {
    return "bg-emerald-100 text-emerald-800 border-emerald-200";
  }
  if (label === "Safe Call") {
    return "bg-yellow-100 text-yellow-800 border-yellow-200";
  }
  return "bg-red-100 text-red-800 border-red-200";
}

function isBiasedPath(clue: Round1Clue | null) {
  return clue?.type === "Misleading";
}

function getRound2Result(clue: Round2Clue, biased: boolean) {
  if (typeof clue.result === "string") return clue.result;
  return biased ? clue.result.biased : clue.result.default;
}

export default function HomePage() {
  const [screen, setScreen] = useState<Screen>("home");
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);

  const [selectedClue1, setSelectedClue1] = useState<Round1Clue | null>(null);
  const [selectedClue2, setSelectedClue2] = useState<Round2Clue | null>(null);
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);

  const currentPuzzle = typedPuzzles[currentPuzzleIndex];
  const biasedPath = isBiasedPath(selectedClue1);

  const cluesUsed = useMemo(() => {
    return [selectedClue1, selectedClue2].filter(Boolean).length;
  }, [selectedClue1, selectedClue2]);

  const isCorrect = selectedDecision === currentPuzzle.correct;
  const score = getScore(isCorrect, cluesUsed);
  const scoreLabel = getScoreLabel(isCorrect, cluesUsed);

  function startPuzzle(index: number) {
    setCurrentPuzzleIndex(index);
    setSelectedClue1(null);
    setSelectedClue2(null);
    setSelectedDecision(null);
    setScreen("scenario");
  }

  function handleRound1Choice(clue: Round1Clue) {
    setSelectedClue1(clue);
    setScreen("investigate2");
  }

  function handleRound2Choice(clue: Round2Clue) {
    setSelectedClue2(clue);
    setScreen("decision");
  }

  function handleDecision(decisionId: string) {
    setSelectedDecision(decisionId);
    setScreen("reveal");
  }

  function resetToHome() {
    setSelectedClue1(null);
    setSelectedClue2(null);
    setSelectedDecision(null);
    setScreen("home");
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">TEST VERSION</h1>
          <p className="mt-2 text-lg text-slate-600">
            Make the call with limited information.
          </p>
        </header>

        {screen === "home" && (
          <section className="space-y-4">
            {typedPuzzles.map((puzzle, index) => (
              <button
                key={puzzle.id}
                onClick={() => startPuzzle(index)}
                className="w-full rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:border-slate-300 hover:shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-medium uppercase tracking-wide text-slate-500">
                      {puzzle.role}
                    </div>
                    <h2 className="mt-1 text-2xl font-semibold">{puzzle.title}</h2>
                    <p className="mt-2 text-slate-600">{puzzle.difficulty}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                    Start
                  </span>
                </div>
              </button>
            ))}
          </section>
        )}

        {screen === "scenario" && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-sm uppercase tracking-wide text-slate-500">
                  {currentPuzzle.role}
                </div>
                <h2 className="text-3xl font-bold">{currentPuzzle.title}</h2>
              </div>
              <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                {currentPuzzle.difficulty}
              </div>
            </div>

            {currentPuzzle.image && (
              <img
                src={currentPuzzle.image}
                alt={currentPuzzle.title}
                className="mb-6 h-64 w-full rounded-xl object-cover"
              />
            )}

            <p className="text-lg leading-8 text-slate-700">
              {currentPuzzle.scenario}
            </p>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setScreen("investigate1")}
                className="rounded-xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-800"
              >
                Begin Investigation
              </button>
              <button
                onClick={resetToHome}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Back
              </button>
            </div>
          </section>
        )}

        {screen === "investigate1" && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <div className="text-sm uppercase tracking-wide text-slate-500">
                Round 1
              </div>
              <h2 className="text-2xl font-bold">Choose your first clue</h2>
              <p className="mt-2 text-slate-600">
                Pick one line of inquiry to shape your understanding of the case.
              </p>
            </div>

            <div className="space-y-4">
              {currentPuzzle.cluesRound1.map((clue) => (
                <button
                  key={clue.title}
                  onClick={() => handleRound1Choice(clue)}
                  className="w-full rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
                >
                  <div className="text-lg font-semibold">{clue.title}</div>
                  <p className="mt-3 text-slate-700">{clue.result}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {screen === "investigate2" && selectedClue1 && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <div className="text-sm uppercase tracking-wide text-slate-500">
                Round 2
              </div>
              <h2 className="text-2xl font-bold">Choose your second clue</h2>
              <p className="mt-2 text-slate-600">
                Review one more piece of evidence before making your call.
              </p>
            </div>

            <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-medium text-slate-500">
                First clue selected
              </div>
              <div className="mt-1 text-lg font-semibold">{selectedClue1.title}</div>
              <div className="mt-2 text-slate-700">{selectedClue1.result}</div>
            </div>

            <div className="space-y-4">
              {currentPuzzle.cluesRound2.map((clue) => (
                <button
                  key={clue.title}
                  onClick={() => handleRound2Choice(clue)}
                  className="w-full rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
                >
                  <div className="text-lg font-semibold">{clue.title}</div>
                  <p className="mt-3 text-slate-700">
                    {getRound2Result(clue, biasedPath)}
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}

        {screen === "decision" && selectedClue1 && selectedClue2 && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <div className="text-sm uppercase tracking-wide text-slate-500">
                Final Decision
              </div>
              <h2 className="text-2xl font-bold">What do you do?</h2>
              <p className="mt-2 text-slate-600">
                Commit to the action you believe an expert should take.
              </p>
            </div>

            <div className="mb-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-medium text-slate-500">Clue 1</div>
                <div className="mt-1 font-semibold">{selectedClue1.title}</div>
                <div className="mt-2 text-slate-700">{selectedClue1.result}</div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-medium text-slate-500">Clue 2</div>
                <div className="mt-1 font-semibold">{selectedClue2.title}</div>
                <div className="mt-2 text-slate-700">
                  {getRound2Result(selectedClue2, biasedPath)}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {currentPuzzle.decisions.map((decision) => (
                <button
                  key={decision.id}
                  onClick={() => handleDecision(decision.id)}
                  className="w-full rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 font-bold text-white">
                      {decision.id}
                    </span>
                    <span className="text-lg font-medium">{decision.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {screen === "reveal" && selectedDecision && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <h2 className="text-3xl font-bold">Case Review</h2>
              <span
                className={`rounded-full border px-4 py-2 text-sm font-semibold ${getBadgeClasses(
                  scoreLabel
                )}`}
              >
                {scoreLabel} · {score} pts
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-medium text-slate-500">Your choice</div>
                <div className="mt-1 text-lg font-semibold">
                  {selectedDecision}.{" "}
                  {
                    currentPuzzle.decisions.find((d) => d.id === selectedDecision)
                      ?.text
                  }
                </div>
                <p className="mt-3 text-slate-700">
                  {currentPuzzle.outcomes[selectedDecision]}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-medium text-slate-500">
                  Expert action
                </div>
                <div className="mt-1 text-lg font-semibold">
                  {currentPuzzle.expertAction}
                </div>
                <p className="mt-3 text-slate-700">
                  {currentPuzzle.expertExplanation}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-4">
              <div className="text-sm font-medium text-blue-700">Lesson</div>
              <p className="mt-2 text-blue-900">{currentPuzzle.lesson}</p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={resetToHome}
                className="rounded-xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-800"
              >
                Back to Home
              </button>
              <button
                onClick={() => startPuzzle(currentPuzzleIndex)}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Play Again
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}