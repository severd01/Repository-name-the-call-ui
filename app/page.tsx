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

type ClueType = "helpful" | "neutral" | "misleading";

type Round1Clue = {
  title: string;
  result: string;
  type: ClueType;
};

type BranchingResult = {
  helpful: string;
  neutral: string;
  misleading: string;
};

type Round2Clue = {
  title: string;
  result: BranchingResult;
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

function getRound2Result(clue: Round2Clue, clue1: Round1Clue | null) {
  if (!clue1) return "";
  return clue.result[clue1.type];
}

function ClueSummaryCard({
  label,
  title,
  body,
}: {
  label: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 shadow-sm">
      <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-2xl font-medium leading-tight text-slate-700">
        {title}
      </div>
      <div className="mt-3 text-lg leading-8 text-slate-600">{body}</div>
    </div>
  );
}

function ChoiceDivider({ label }: { label: string }) {
  return (
    <div className="my-5 flex items-center gap-3 text-sm font-medium text-slate-400">
      <div className="h-px flex-1 bg-slate-200" />
      <span>{label}</span>
      <div className="h-px flex-1 bg-slate-200" />
    </div>
  );
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

  const isCorrect = selectedDecision === currentPuzzle?.correct;
  const score = getScore(!!isCorrect, cluesUsed);
  const scoreLabel = getScoreLabel(!!isCorrect, cluesUsed);

  const chosenDecision = currentPuzzle?.decisions.find(
    (d) => d.id === selectedDecision
  );
  const correctDecision = currentPuzzle?.decisions.find(
    (d) => d.id === currentPuzzle.correct
  );

  const round2ResolvedText = useMemo(() => {
    if (!selectedClue1 || !selectedClue2) return null;
    return getRound2Result(selectedClue2, selectedClue1);
  }, [selectedClue1, selectedClue2]);
  const nextPuzzlePreview =
    typedPuzzles[(currentPuzzleIndex + 1) % typedPuzzles.length];
  const todayRole = currentPuzzle.role.replace("Emergency Room", "ER");
  const tomorrowRole = nextPuzzlePreview.role.replace(
    "Emergency Room",
    "ER"
  );
  const shellClass =
    "rounded-[28px] border border-slate-200 bg-white px-5 py-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]";
  const cardClass = "rounded-xl border border-slate-200 bg-slate-50 px-4 py-5 shadow-sm";
  const primaryButtonClass =
    "rounded-[8px] bg-[#2f63b8] px-5 py-3 text-lg font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_12px_rgba(47,99,184,0.35)] transition hover:bg-[#27549c]";
  const secondaryButtonClass =
    "rounded-[8px] border border-slate-200 bg-white px-5 py-3 text-lg font-medium text-slate-700 shadow-sm transition hover:bg-slate-50";
  const sectionEyebrow =
    "text-sm font-semibold uppercase tracking-[0.22em] text-slate-500";

  function clearSelections() {
    setSelectedClue1(null);
    setSelectedClue2(null);
    setSelectedDecision(null);
  }

  function startPuzzle(index: number) {
    setCurrentPuzzleIndex(index);
    clearSelections();
    setScreen("scenario");
  }

  function handleRound1Choice(clue: Round1Clue) {
    setSelectedClue1(clue);
    setSelectedClue2(null);
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

  function resetCurrentPuzzle() {
    clearSelections();
    setScreen("scenario");
  }

  function resetToHome() {
    clearSelections();
    setScreen("home");
  }

  function nextCase() {
    if (currentPuzzleIndex < typedPuzzles.length - 1) {
      startPuzzle(currentPuzzleIndex + 1);
    } else {
      resetToHome();
    }
  }

  if (!currentPuzzle) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold">No puzzles found</h1>
          <p className="mt-2 text-slate-600">
            Add at least one puzzle to <code>puzzles.json</code>.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#ecebf1] px-4 py-8 text-slate-900">
      <div className={`mx-auto ${screen === "home" ? "max-w-sm" : "max-w-3xl"}`}>
        <header className={`${screen === "home" ? "mb-5 text-center" : "mb-8"}`}>
          <h1
            className={`tracking-tight text-slate-700 ${
              screen === "home"
                ? "font-serif text-5xl font-semibold uppercase"
                : "text-4xl font-bold"
            }`}
          >
            The Call
          </h1>
          <p className={`${screen === "home" ? "mt-3 text-xl" : "mt-2 text-lg"} text-slate-600`}>
            {screen === "home"
              ? "Make the call. Live with the outcome."
              : "Make the call with limited information."}
          </p>
        </header>

        {screen === "home" && (
          <section className={shellClass}>
            <div className="border-t border-slate-200 pt-5">
              <div className={`${sectionEyebrow} text-center`}>
                Today&apos;s Call
              </div>
              <div className={`${cardClass} mt-4 text-center`}>
                <div className="text-[1.9rem] leading-tight font-medium text-slate-700">
                  You are the {todayRole} today.
                </div>
                <button
                  onClick={() => startPuzzle(currentPuzzleIndex)}
                  className={`mt-5 w-full ${primaryButtonClass}`}
                >
                  Take the Case
                </button>
              </div>
            </div>

            <div className="mt-5 border-t border-slate-200 pt-5">
              <div className={`${sectionEyebrow} text-center`}>
                Tomorrow&apos;s Call
              </div>
              <div className={`${cardClass} mt-4 text-center`}>
                <div className="text-[1.75rem] leading-tight font-medium text-slate-700">
                  Role: {tomorrowRole} &#128274;
                </div>
                <div className="mt-3 text-xl text-slate-500">
                  Available in 14h 32m
                </div>
              </div>
            </div>
          </section>
        )}

        {screen === "scenario" && (
          <section className={shellClass}>
            <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <div className={sectionEyebrow}>
                  {currentPuzzle.role}
                </div>
                <h2 className="mt-2 text-4xl font-medium leading-tight text-slate-700">
                  {currentPuzzle.title}
                </h2>
              </div>
              <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold uppercase tracking-[0.14em] text-slate-600">
                {currentPuzzle.difficulty}
              </div>
            </div>

            {currentPuzzle.image && (
              <img
                src={currentPuzzle.image}
                alt={currentPuzzle.title}
                className="mb-6 h-72 w-full rounded-xl object-cover shadow-sm"
              />
            )}

            <p className="text-[1.32rem] leading-9 text-slate-600">
              {currentPuzzle.scenario}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => setScreen("decision")}
                className={primaryButtonClass}
              >
                Make the Call Now
              </button>
              <button
                onClick={() => setScreen("investigate1")}
                className={secondaryButtonClass}
              >
                Begin Investigation
              </button>
              <button
                onClick={resetToHome}
                className={secondaryButtonClass}
              >
                Back
              </button>
            </div>
          </section>
        )}

        {screen === "investigate1" && (
          <section className={shellClass}>
            <div className="mb-6 border-b border-slate-200 pb-4">
              <div className={sectionEyebrow}>
                Round 1 - 2 Moves Remaining
              </div>
              <h2 className="mt-2 text-4xl font-medium text-slate-700">
                Choose your first clue
              </h2>
              <p className="mt-3 text-xl leading-8 text-slate-600">
                Pick one line of inquiry to shape your understanding of the case.
              </p>
            </div>

            <div className="space-y-4">
              {currentPuzzle.cluesRound1.map((clue) => (
                <button
                  key={clue.title}
                  onClick={() => handleRound1Choice(clue)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-5 py-4 text-left text-xl font-medium text-slate-700 shadow-sm transition hover:border-[#2f63b8]/35 hover:bg-slate-50"
                >
                  <div>{clue.title}</div>
                </button>
              ))}
            </div>

            <ChoiceDivider label="or" />

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setScreen("decision")}
                className={primaryButtonClass}
              >
                Make the Call Now
              </button>
              <button
                onClick={() => setScreen("scenario")}
                className={secondaryButtonClass}
              >
                Back to Scenario
              </button>
            </div>
          </section>
        )}

        {screen === "investigate2" && selectedClue1 && (
          <section className={shellClass}>
            <div className="mb-6 border-b border-slate-200 pb-4">
              <div className={sectionEyebrow}>
                Round 2 - 1 Moves Remaining
              </div>
              <h2 className="mt-2 text-4xl font-medium text-slate-700">
                Choose your second clue
              </h2>
              <p className="mt-3 text-xl leading-8 text-slate-600">
                Review one more piece of evidence before making your call.
              </p>
            </div>

            <div className="mb-6">
              <ClueSummaryCard
                label="First clue selected"
                title={selectedClue1.title}
                body={selectedClue1.result}
              />
            </div>

            <div className="space-y-4">
              {currentPuzzle.cluesRound2.map((clue) => (
                <button
                  key={clue.title}
                  onClick={() => handleRound2Choice(clue)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-5 py-4 text-left text-xl font-medium text-slate-700 shadow-sm transition hover:border-[#2f63b8]/35 hover:bg-slate-50"
                >
                  <div>{clue.title}</div>
                </button>
              ))}
            </div>

            <ChoiceDivider label="or" />

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setScreen("decision")}
                className={primaryButtonClass}
              >
                Make the Call
              </button>
              <button
                onClick={() => {
                  setSelectedClue1(null);
                  setSelectedClue2(null);
                  setScreen("investigate1");
                }}
                className={secondaryButtonClass}
              >
                Change First Clue
              </button>
            </div>
          </section>
        )}

        {screen === "decision" && (
          <section className={shellClass}>
            <div className="mb-6 border-b border-slate-200 pb-4">
              <div className={sectionEyebrow}>
                Final Decision
              </div>
              <h2 className="mt-2 text-4xl font-medium text-slate-700">
                What do you do?
              </h2>
              <p className="mt-3 text-xl leading-8 text-slate-600">
                Commit to the action you believe an expert should take.
              </p>
            </div>

            {(selectedClue1 || selectedClue2) && (
              <div className="mb-6 grid gap-4 md:grid-cols-2">
                {selectedClue1 && (
                  <ClueSummaryCard
                    label="Clue 1"
                    title={selectedClue1.title}
                    body={selectedClue1.result}
                  />
                )}

                {selectedClue2 && round2ResolvedText && (
                  <ClueSummaryCard
                    label="Clue 2"
                    title={selectedClue2.title}
                    body={round2ResolvedText}
                  />
                )}
              </div>
            )}

            <div className="mb-6 flex flex-wrap gap-3">
              <button
                onClick={() =>
                  setScreen(selectedClue1 ? "investigate2" : "scenario")
                }
                className={secondaryButtonClass}
              >
                Back
              </button>
            </div>

            <div className="space-y-4">
              {currentPuzzle.decisions.map((decision) => (
                <button
                  key={decision.id}
                  onClick={() => handleDecision(decision.id)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-5 py-4 text-left shadow-sm transition hover:border-[#2f63b8]/35 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2f63b8] text-lg font-bold text-white shadow-sm">
                      {decision.id}
                    </span>
                    <span className="text-xl leading-8 font-medium text-slate-700">
                      {decision.text}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {screen === "reveal" && selectedDecision && (
          <section className={shellClass}>
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <h2 className="text-4xl font-medium text-slate-700">Case Review</h2>
              <span
                className={`rounded-full border px-4 py-2 text-sm font-semibold shadow-sm ${getBadgeClasses(
                  scoreLabel
                )}`}
              >
                {scoreLabel} · {score} pts
              </span>
            </div>

            {(selectedClue1 || selectedClue2) && (
              <div className="mb-6 grid gap-4 md:grid-cols-2">
                {selectedClue1 && (
                  <ClueSummaryCard
                    label="Your Clue 1"
                    title={selectedClue1.title}
                    body={selectedClue1.result}
                  />
                )}
                {selectedClue2 && round2ResolvedText && (
                  <ClueSummaryCard
                    label="Your Clue 2"
                    title={selectedClue2.title}
                    body={round2ResolvedText}
                  />
                )}
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className={cardClass}>
                <div className={sectionEyebrow}>
                  Your choice
                </div>
                <div className="mt-2 text-2xl font-medium leading-tight text-slate-700">
                  {selectedDecision}. {chosenDecision?.text}
                </div>
                <p className="mt-3 text-lg leading-8 text-slate-600">
                  {currentPuzzle.outcomes[selectedDecision] ??
                    "No outcome written for this decision yet."}
                </p>
              </div>

              <div className={cardClass}>
                <div className={sectionEyebrow}>
                  Expert action
                </div>
                <div className="mt-2 text-2xl font-medium leading-tight text-slate-700">
                  {currentPuzzle.correct}. {correctDecision?.text}
                </div>
                <p className="mt-3 text-lg leading-8 text-slate-600">{currentPuzzle.expertAction}</p>
                <p className="mt-3 text-lg leading-8 text-slate-600">
                  {currentPuzzle.expertExplanation}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-5 shadow-sm">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
                Lesson
              </div>
              <p className="mt-3 text-lg leading-8 text-blue-900">{currentPuzzle.lesson}</p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={resetToHome}
                className={primaryButtonClass}
              >
                Back to Home
              </button>
              <button
                onClick={resetCurrentPuzzle}
                className={secondaryButtonClass}
              >
                Play Again
              </button>
              {currentPuzzleIndex < typedPuzzles.length - 1 && (
                <button
                  onClick={nextCase}
                  className={secondaryButtonClass}
                >
                  Next Case
                </button>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
