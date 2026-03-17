"use client";

import { useState } from "react";
import { puzzles, type ChoiceId, type Clue } from "../data/puzzles";

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
    <main className="min-h-screen bg-neutral-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-xl p-8">
        {screen === "home" && (
          <div className="text-center">
            <p className="text-sm tracking-[0.25em] text-neutral-500 mb-4">
              THE CALL
            </p>

            <h1 className="text-4xl font-bold text-neutral-900 mb-4">
              Could you make the right call?
            </h1>

            <p className="text-neutral-600 mb-8">
              Step into the role of the expert. Investigate clues. Make the
              decision.
            </p>

            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 text-left mb-6">
              <p className="text-xs font-semibold tracking-[0.2em] text-neutral-500 mb-2">
                PUZZLE {puzzleIndex + 1} OF {puzzles.length}
              </p>

              <h2 className="text-2xl font-bold text-neutral-900 mb-1">
                {puzzle.title}
              </h2>

              <p className="text-sm text-neutral-500 mb-4">
                {puzzle.role} • {puzzle.difficulty}
              </p>

              <p className="text-neutral-700">{puzzle.scenario}</p>
            </div>

            <button
              onClick={() => setScreen("scenario")}
              className="w-full rounded-2xl bg-black text-white py-4 text-lg font-semibold hover:bg-neutral-800"
            >
              Start Puzzle
            </button>
          </div>
        )}

        {screen === "scenario" && (
          <div>
            <p className="text-sm tracking-[0.25em] text-neutral-500 mb-4 text-center">
              THE CALL
            </p>

            <h1 className="text-3xl font-bold mb-3">{puzzle.title}</h1>

            <p className="text-sm text-neutral-500 mb-6">
              {puzzle.role} • {puzzle.difficulty}
            </p>

            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 mb-6 text-neutral-700 leading-7">
              {puzzle.scenario}
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-4 mb-6">
              <p className="text-sm text-neutral-600">
                Clues used: <span className="font-semibold">0 / 2</span>
              </p>
              <p className="text-sm text-neutral-600 mt-1">
                You may make the call immediately, or investigate up to two
                clues first.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setScreen("decision")}
                className="w-full rounded-2xl bg-black text-white py-4 font-semibold hover:bg-neutral-800"
              >
                Make the Call Now
              </button>

              <button
                onClick={() => setScreen("investigate1")}
                className="w-full rounded-2xl border border-neutral-300 py-4 font-semibold hover:bg-neutral-50"
              >
                Investigate a Clue
              </button>
            </div>
          </div>
        )}

        {screen === "investigate1" && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Choose a clue</h2>
            <p className="text-neutral-600 mb-6">Clues used: 0 / 2</p>

            <div className="space-y-3">
              {puzzle.cluesRound1.map((clue) => (
                <button
                  key={clue.title}
                  onClick={() => selectFirstClue(clue)}
                  className="w-full text-left rounded-2xl border border-neutral-200 p-4 hover:bg-neutral-50"
                >
                  {clue.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {screen === "investigate2" && (
          <div>
            <h2 className="text-2xl font-bold mb-2">First clue found</h2>

            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 mb-4 text-neutral-700">
              {usedClues[0]?.result}
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-4 mb-6">
              <p className="text-sm text-neutral-600">
                Clues used: <span className="font-semibold">1 / 2</span>
              </p>
              <p className="text-sm text-neutral-600 mt-1">
                You can make the call now, or investigate one more clue.
              </p>
            </div>

            <button
              onClick={() => setScreen("decision")}
              className="w-full rounded-2xl bg-black text-white py-4 mb-4 font-semibold hover:bg-neutral-800"
            >
              Make the Call
            </button>

            <div className="space-y-3">
              {puzzle.cluesRound2.map((clue) => (
                <button
                  key={clue.title}
                  onClick={() => selectSecondClue(clue)}
                  className="w-full text-left rounded-2xl border border-neutral-200 p-4 hover:bg-neutral-50"
                >
                  {clue.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {screen === "decision" && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Make the Call</h2>

            <div className="rounded-2xl border border-neutral-200 bg-white p-4 mb-6">
              <p className="text-sm text-neutral-600">
                Clues used:{" "}
                <span className="font-semibold">{usedClues.length} / 2</span>
              </p>
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

            <div className="space-y-3 mt-6">
              {puzzle.decisions.map((d) => (
                <button
                  key={d.id}
                  onClick={() => submitDecision(d.id)}
                  className="w-full text-left rounded-2xl border border-neutral-200 p-4 hover:bg-neutral-50"
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
            <h2 className="text-2xl font-bold mb-4">Result</h2>

            <div
              className={`rounded-2xl p-4 mb-4 border ${
                isCorrect
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <p className="font-semibold mb-1">
                {isCorrect ? "Correct" : "Incorrect"}
              </p>
              <p className="text-sm text-neutral-700">
                {scoreLabel} • {score} points
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
              <p className="font-semibold mb-2">Lesson</p>
              <p>{puzzle.lesson}</p>
            </div>

            <button
              onClick={resetPuzzle}
              className="w-full rounded-2xl bg-black text-white py-4 font-semibold hover:bg-neutral-800"
            >
              Play Again
            </button>

            {puzzleIndex < puzzles.length - 1 && (
              <button
                onClick={nextPuzzle}
                className="w-full mt-3 rounded-2xl bg-gray-200 py-4 text-black font-semibold hover:bg-gray-300"
              >
                Next Puzzle
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}