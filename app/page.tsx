"use client";

import { useState } from "react";
import puzzles from "../data/puzzles.json";
type Screen =
  | "home"
  | "scenario"
  | "investigate1"
  | "investigate2"
  | "decision"
  | "reveal";

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
  if (label === "Perfect Call") return "bg-green-100 text-green-800 border-green-200";
  if (label === "Strong Call") return "bg-emerald-100 text-emerald-800 border-emerald-200";
  if (label === "Safe Call") return "bg-amber-100 text-amber-800 border-amber-200";
  return "bg-red-100 text-red-800 border-red-200";
}

export default function Home() {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const puzzle = puzzles[puzzleIndex];

  const [screen, setScreen] = useState<Screen>("home");
  const [usedClues, setUsedClues] = useState<Clue[]>([]);
  const [decision, setDecision] = useState<ChoiceId | "">("");
  const [score, setScore] = useState(0);
  const [scoreLabel, setScoreLabel] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);

  function resetPuzzle() {
    setUsedClues([]);
    setDecision("");
    setScore(0);
    setScoreLabel("");
    setIsCorrect(false);
    setScreen("home");
  }

  function nextPuzzle() {
    if (puzzleIndex < puzzles.length - 1) {
      setPuzzleIndex((prev) => prev + 1);
      setUsedClues([]);
      setDecision("");
      setScore(0);
      setScoreLabel("");
      setIsCorrect(false);
      setScreen("home");
    }
  }

  function selectFirstClue(clue: Clue) {
    setUsedClues([clue]);
    setScreen("investigate2");
  }

  function selectSecondClue(clue: Clue) {
    setUsedClues((prev) => [...prev, clue]);
    setScreen("decision");
  }

  function submitDecision(choice: ChoiceId) {
    const correct = choice === puzzle.correct;
    const clueCount = usedClues.length;

    setDecision(choice);
    setIsCorrect(correct);
    setScore(getScore(correct, clueCount));
    setScoreLabel(getScoreLabel(correct, clueCount));
    setScreen("reveal");
  }

  const correctDecision = puzzle.decisions.find((d) => d.id === puzzle.correct);
  const chosenDecision = puzzle.decisions.find((d) => d.id === decision);

  return (
    <main className="min-h-screen bg-neutral-100 flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-md overflow-hidden rounded-[28px] bg-white shadow-2xl border border-neutral-200">
        <div className="bg-neutral-950 px-6 py-6 text-white">
          <p className="text-[11px] uppercase tracking-[0.35em] text-neutral-400 mb-2">
            The Call
          </p>
          <h1 className="text-3xl font-bold leading-tight">
            Could you make the right call?
          </h1>
          <p className="mt-3 text-sm text-neutral-300">
            Step into the role. Read the case. Investigate if needed. Then decide.
          </p>
        </div>

        <div className="p-6">
          {screen === "home" && (
            <div className="text-center">
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 text-left mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500 mb-2">
                  Case File {puzzleIndex + 1} of {puzzles.length}
                </p>
                {puzzle.image && (
  <div className="mb-4 overflow-hidden rounded-xl">
    <img
      src={puzzle.image}
      alt={puzzle.title}
      className="w-full h-44 object-cover"
    />
  </div>
)}


                <h2 className="text-2xl font-bold text-neutral-900 mb-1">
                  {puzzle.title}
                </h2>

                <p className="text-sm text-neutral-500 mb-4">
                  {puzzle.role} • {puzzle.difficulty}
                </p>

                <p className="text-neutral-700 leading-7">
                  {puzzle.scenario}
                </p>
              </div>

              <button
                onClick={() => setScreen("scenario")}
                className="w-full rounded-2xl bg-black text-white py-4 text-lg font-semibold hover:bg-neutral-800 transition"
              >
                Make the Call
              </button>
            </div>
          )}

          {screen === "scenario" && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500 mb-2">
                Case File
              </p>

              <h2 className="text-3xl font-bold mb-2 text-neutral-950">
                {puzzle.title}
              </h2>

              <p className="text-sm text-neutral-500 mb-5">
                {puzzle.role} • {puzzle.difficulty}
              </p>

              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 mb-4 text-neutral-700 leading-7">
                {puzzle.scenario}
              </div>

              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 mb-6">
                <p className="text-sm font-semibold text-red-800 mb-1">
                  What’s at stake
                </p>
                <p className="text-sm text-red-700">
                  If you make the wrong call, the consequences could be serious.
                </p>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white px-4 py-3 mb-6">
                <span className="text-sm text-neutral-600">Clues used</span>
                <span className="rounded-full bg-neutral-900 text-white text-sm font-semibold px-3 py-1">
                  0 / 2
                </span>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setScreen("decision")}
                  className="w-full rounded-2xl bg-black text-white py-4 font-semibold hover:bg-neutral-800 transition"
                >
                  Make the Call Now
                </button>

                <button
                  onClick={() => setScreen("investigate1")}
                  className="w-full rounded-2xl border border-neutral-300 py-4 font-semibold hover:bg-neutral-50 transition"
                >
                  Investigate a Clue
                </button>
              </div>
            </div>
          )}

          {screen === "investigate1" && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Investigation</h2>
              <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white px-4 py-3 mb-6">
                <span className="text-sm text-neutral-600">Clues used</span>
                <span className="rounded-full bg-neutral-900 text-white text-sm font-semibold px-3 py-1">
                  0 / 2
                </span>
              </div>

              <div className="space-y-3">
                {puzzle.cluesRound1.map((clue) => (
                  <button
                    key={clue.title}
                    onClick={() => selectFirstClue(clue)}
                    className="w-full text-left rounded-2xl border border-neutral-200 p-4 hover:bg-neutral-50 transition"
                  >
                    {clue.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {screen === "investigate2" && (
            <div>
              <h2 className="text-2xl font-bold mb-3">First clue found</h2>

              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 mb-4 text-neutral-700">
                {usedClues[0]?.result}
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white px-4 py-3 mb-6">
                <span className="text-sm text-neutral-600">Clues used</span>
                <span className="rounded-full bg-neutral-900 text-white text-sm font-semibold px-3 py-1">
                  1 / 2
                </span>
              </div>

              <button
                onClick={() => setScreen("decision")}
                className="w-full rounded-2xl bg-black text-white py-4 mb-4 font-semibold hover:bg-neutral-800 transition"
              >
                Make the Call
              </button>

              <div className="space-y-3">
                {puzzle.cluesRound2.map((clue) => (
                  <button
                    key={clue.title}
                    onClick={() => selectSecondClue(clue)}
                    className="w-full text-left rounded-2xl border border-neutral-200 p-4 hover:bg-neutral-50 transition"
                  >
                    {clue.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {screen === "decision" && (
            <div>
              <h2 className="text-2xl font-bold mb-3">Make the Call</h2>

              <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white px-4 py-3 mb-6">
                <span className="text-sm text-neutral-600">Clues used</span>
                <span className="rounded-full bg-neutral-900 text-white text-sm font-semibold px-3 py-1">
                  {usedClues.length} / 2
                </span>
              </div>

              {usedClues.map((clue, index) => (
                <div
                  key={`${clue.title}-${index}`}
                  className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 mb-4 text-neutral-700"
                >
                  <p className="font-semibold mb-2">Clue {index + 1}</p>
                  <p>{clue.result}</p>
                </div>
              ))}

              <div className="space-y-3 mt-4">
                {puzzle.decisions.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => submitDecision(d.id)}
                    className="w-full text-left rounded-2xl border border-neutral-200 p-4 hover:bg-neutral-50 transition"
                  >
                    <span className="font-bold mr-2">{d.id}.</span>
                    {d.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {screen === "reveal" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Expert Verdict</h2>

              <div className="flex items-center justify-between gap-3 mb-4">
                <div
                  className={`rounded-full border px-4 py-2 text-sm font-semibold ${getBadgeClasses(
                    scoreLabel
                  )}`}
                >
                  {scoreLabel}
                </div>

                <div className="rounded-full bg-neutral-900 text-white px-4 py-2 text-sm font-semibold">
                  {score} pts
                </div>
              </div>

              <div
                className={`rounded-2xl p-4 mb-4 border ${
                  isCorrect
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <p className="font-semibold mb-1">
                  {isCorrect ? "You made the right call." : "You missed the right call."}
                </p>
                <p className="text-sm text-neutral-700">
                  {isCorrect
                    ? "Your judgment matched the expert decision."
                    : "The expert saw the case differently."}
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 mb-4 text-neutral-700">
                <p className="font-semibold mb-2">Your decision</p>
                <p className="mb-2">
                  {decision}. {chosenDecision?.text}
                </p>
                <p>{decision ? puzzle.outcomes[decision] : ""}</p>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 mb-4 text-neutral-700">
                <p className="font-semibold mb-2">What the expert would do</p>
                <p className="mb-2">
                  {puzzle.correct}. {correctDecision?.text}
                </p>
                <p>{puzzle.expertAction}</p>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 mb-4 text-neutral-700">
                <p className="font-semibold mb-2">Why that was the right call</p>
                <p>{puzzle.expertExplanation}</p>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 mb-6 text-neutral-700">
                <p className="font-semibold mb-2">What made this tricky</p>
                <p>{puzzle.lesson}</p>
              </div>

              <button
                onClick={resetPuzzle}
                className="w-full rounded-2xl bg-black text-white py-4 font-semibold hover:bg-neutral-800 transition"
              >
                Play Again
              </button>

              {puzzleIndex < puzzles.length - 1 && (
                <button
                  onClick={nextPuzzle}
                  className="w-full mt-3 rounded-2xl bg-gray-200 py-4 text-black font-semibold hover:bg-gray-300 transition"
                >
                  Next Case
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}