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

type Round1Clue = {
  title: string;
  result: string;
};

type Round2Clue = {
  title: string;
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

function getRound2Result(clue: Round2Clue) {
  if (typeof clue.result === "string") return clue.result;
  return clue.result.default;
}

export default function HomePage() {
  const [screen, setScreen] = useState<Screen>("home");
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);

  const [selectedClue1, setSelectedClue1] = useState<Round1Clue | null>(null);
  const [selectedClue2, setSelectedClue2] = useState<Round2Clue | null>(null);
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);

  const currentPuzzle = typedPuzzles[currentPuzzleIndex];

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
    setScreen("home");
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-3xl">

        {/* HEADER */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">The Call</h1>
          <p className="mt-2 text-lg text-slate-600">
            Make the call with limited information.
          </p>
        </header>

        {/* HOME */}
        {screen === "home" && (
          <section className="space-y-4">
            {typedPuzzles.map((puzzle, index) => (
              <button
                key={puzzle.id}
                onClick={() => startPuzzle(index)}
                className="w-full rounded-2xl border bg-white p-6 text-left shadow-sm hover:shadow"
              >
                <div>
                  <div className="text-sm text-slate-500">
                    {puzzle.role}
                  </div>
                  <h2 className="text-2xl font-semibold">
                    {puzzle.title}
                  </h2>
                  <p className="text-slate-600">{puzzle.difficulty}</p>
                </div>
              </button>
            ))}
          </section>
        )}

        {/* SCENARIO */}
        {screen === "scenario" && (
          <section className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-bold">{currentPuzzle.title}</h2>
            <p className="mt-4 text-slate-700">{currentPuzzle.scenario}</p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setScreen("decision")}
                className="bg-slate-900 text-white px-4 py-2 rounded-lg"
              >
                Make the Call Now
              </button>

              <button
                onClick={() => setScreen("investigate1")}
                className="border px-4 py-2 rounded-lg"
              >
                Investigate
              </button>
            </div>
          </section>
        )}

        {/* ROUND 1 */}
        {screen === "investigate1" && (
          <section className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold">Choose your first clue</h2>

            <div className="mt-4 space-y-3">
              {currentPuzzle.cluesRound1.map((clue) => (
                <button
                  key={clue.title}
                  onClick={() => handleRound1Choice(clue)}
                  className="w-full border p-4 rounded-xl text-left hover:bg-slate-50"
                >
                  {clue.title}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ROUND 2 */}
        {screen === "investigate2" && selectedClue1 && (
          <section className="bg-white p-6 rounded-2xl shadow-sm">

            <div className="mb-4">
              <div className="text-sm text-slate-500">
                Your line of thinking
              </div>
              <div className="font-semibold">{selectedClue1.title}</div>
              <div className="text-slate-700">{selectedClue1.result}</div>
            </div>

            <button
              onClick={() => setScreen("decision")}
              className="mb-4 bg-slate-900 text-white px-4 py-2 rounded-lg"
            >
              Make the Call
            </button>

            <h3 className="font-semibold">Choose another clue</h3>

            <div className="mt-3 space-y-3">
              {currentPuzzle.cluesRound2.map((clue) => (
                <button
                  key={clue.title}
                  onClick={() => handleRound2Choice(clue)}
                  className="w-full border p-4 rounded-xl text-left hover:bg-slate-50"
                >
                  {clue.title}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* DECISION */}
        {screen === "decision" && (
          <section className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold">What do you do?</h2>

            <div className="mt-4 space-y-3">
              {currentPuzzle.decisions.map((d) => (
                <button
                  key={d.id}
                  onClick={() => handleDecision(d.id)}
                  className="w-full border p-4 rounded-xl text-left hover:bg-slate-50"
                >
                  {d.id}. {d.text}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* REVEAL */}
        {screen === "reveal" && selectedDecision && (
          <section className="bg-white p-6 rounded-2xl shadow-sm">

            <h2 className="text-2xl font-bold mb-2">Case Review</h2>

            <div className={`inline-block px-3 py-1 rounded-full border ${getBadgeClasses(scoreLabel)}`}>
              {scoreLabel} · {score} pts
            </div>

            <div className="mt-4">
              <div className="font-semibold">Your choice</div>
              <p>{currentPuzzle.outcomes[selectedDecision]}</p>
            </div>

            <div className="mt-4">
              <div className="font-semibold">Expert action</div>
              <p>{currentPuzzle.expertExplanation}</p>
            </div>

            <div className="mt-4">
              <div className="font-semibold">Lesson</div>
              <p>{currentPuzzle.lesson}</p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={resetToHome}
                className="bg-slate-900 text-white px-4 py-2 rounded-lg"
              >
                Home
              </button>
            </div>

          </section>
        )}

      </div>
    </main>
  );
}