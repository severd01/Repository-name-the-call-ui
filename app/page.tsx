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
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-sm font-medium text-slate-500">{label}</div>
      <div className="mt-1 text-lg font-semibold">{title}</div>
      <div className="mt-2 text-slate-700">{body}</div>
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
  const shortRole = currentPuzzle.role
    .replace("Emergency Room", "ER")
    .replace("Missile Warning Officer", "Warning Officer");
  const selectedClueTitles = [selectedClue1?.title, selectedClue2?.title].filter(
    Boolean
  ) as string[];
  const round1Status =
    screen === "home" || screen === "scenario"
      ? "Round 1 - 2 Moves Remaining"
      : "Round 1 - 1 Move Remaining";
  const round2Status =
    screen === "investigate2" || screen === "decision" || screen === "reveal"
      ? "Round 2 - 1 Moves Remaining"
      : "Round 2";
  const cardClass =
    "rounded-[28px] border border-slate-200/90 bg-white px-5 py-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)]";
  const buttonPrimaryClass =
    "w-full rounded-[10px] bg-[#2f63b8] px-4 py-3 text-center text-base font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_3px_8px_rgba(47,99,184,0.35)] transition hover:bg-[#27549c]";
  const buttonSecondaryClass =
    "w-full rounded-[10px] border border-slate-200 bg-white px-4 py-3 text-center text-base font-medium text-slate-700 transition hover:bg-slate-50";
  const currentOutcome = selectedDecision
    ? currentPuzzle.outcomes[selectedDecision]
    : null;

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
    <main className="min-h-screen bg-[#ebeaf0] px-5 py-8 text-[#2b3346]">
      <div className="mx-auto max-w-[1480px]">
        <header className="mb-8 flex flex-col gap-2 px-1 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-serif text-4xl font-semibold tracking-tight text-[#31405f]">
              The Call
            </h1>
            <p className="mt-1 text-base text-slate-600">
              Make the call. Live with the outcome.
            </p>
          </div>
          <div className="text-sm text-slate-500">
            {currentPuzzle.title} · {currentPuzzle.difficulty}
          </div>
        </header>

        <section className="grid gap-5 xl:grid-cols-[280px_minmax(0,1.2fr)_minmax(0,1.1fr)_300px]">
          <aside className={`${cardClass} self-start`}>
            <div className="border-b border-slate-200 pb-5 text-center">
              <div className="font-serif text-[2rem] font-semibold uppercase tracking-tight text-[#3b4a67]">
                The Call
              </div>
              <p className="mt-3 text-sm text-slate-600">
                Make the call. Live with the outcome.
              </p>
            </div>

            <div className="mt-5 border-b border-slate-200 pb-5">
              <div className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Today&apos;s Call
              </div>
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-center">
                <div className="text-lg font-medium text-slate-700">
                  You are the {shortRole} today.
                </div>
                <button
                  onClick={() =>
                    screen === "home" ? startPuzzle(currentPuzzleIndex) : resetCurrentPuzzle()
                  }
                  className={`mt-4 ${buttonPrimaryClass}`}
                >
                  {screen === "home" ? "Take the Case" : "Restart the Case"}
                </button>
              </div>
            </div>

            <div className="mt-5">
              <div className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Tomorrow&apos;s Call
              </div>
              <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-center shadow-sm">
                <div className="text-lg font-medium text-slate-700">
                  Role: {nextPuzzlePreview.role}
                </div>
                <div className="mt-2 text-sm text-slate-500">
                  {screen === "reveal"
                    ? "Ready after this case"
                    : "Available once today's call is complete"}
                </div>
                {screen === "reveal" && typedPuzzles.length > 1 ? (
                  <button
                    onClick={nextCase}
                    className={`mt-4 ${buttonSecondaryClass}`}
                  >
                    Open Next Case
                  </button>
                ) : (
                  <div className="mt-4 text-sm text-slate-400">Locked</div>
                )}
              </div>
            </div>
          </aside>

          <section className={`${cardClass} self-start`}>
            <div className="mb-4 flex items-center justify-between gap-4 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 text-lg font-semibold text-[#2f63b8]">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#2f63b8]/40 text-xs">
                  +
                </span>
                <span>{shortRole}</span>
              </div>
              <div className="text-sm font-medium text-slate-500">
                {round1Status}
              </div>
            </div>

            {currentPuzzle.image && (
              <img
                src={currentPuzzle.image}
                alt={currentPuzzle.title}
                className="h-52 w-full rounded-[20px] object-cover"
              />
            )}

            <p className="mt-5 text-[1.05rem] leading-8 text-slate-700">
              {currentPuzzle.scenario}
            </p>

            <div className="mt-5 space-y-3">
              {currentPuzzle.cluesRound1.map((clue) => {
                const isSelected = selectedClue1?.title === clue.title;
                return (
                  <button
                    key={clue.title}
                    onClick={() => handleRound1Choice(clue)}
                    className={`w-full rounded-[10px] border px-4 py-3 text-base font-medium transition ${
                      isSelected
                        ? "border-[#2f63b8] bg-[#edf3ff] text-[#244b8e]"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {clue.title}
                  </button>
                );
              })}
            </div>

            <ChoiceDivider label="or" />

            <div className="space-y-3">
              <button
                onClick={() => setScreen("decision")}
                className={buttonPrimaryClass}
              >
                Make the Call
              </button>
              <button
                onClick={() =>
                  screen === "home" ? startPuzzle(currentPuzzleIndex) : setScreen("scenario")
                }
                className={buttonSecondaryClass}
              >
                {screen === "home" ? "Preview the Case" : "Back to Scenario"}
              </button>
            </div>
          </section>

          <section className={`${cardClass} self-start`}>
            <div className="mb-4 flex items-center justify-between gap-4 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 text-lg font-semibold text-[#2f63b8]">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#2f63b8]/40 text-xs">
                  +
                </span>
                <span>{shortRole}</span>
              </div>
              <div className="text-sm font-medium text-slate-500">
                {screen === "decision" || screen === "reveal"
                  ? "Make the Call"
                  : round2Status}
              </div>
            </div>

            {selectedClue1 ? (
              <>
                {currentPuzzle.image && (
                  <div className="grid gap-4 sm:grid-cols-[160px_minmax(0,1fr)]">
                    <img
                      src={currentPuzzle.image}
                      alt={currentPuzzle.title}
                      className="h-36 w-full rounded-[16px] object-cover"
                    />
                    <div>
                      <div className="text-xl font-semibold text-[#2f63b8]">
                        {selectedClue1.title}
                      </div>
                      <p className="mt-2 text-base leading-7 text-slate-600">
                        {selectedClue1.result}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-5 space-y-3">
                  {screen === "decision" || screen === "reveal"
                    ? currentPuzzle.decisions.map((decision) => {
                        const isChosen = selectedDecision === decision.id;
                        const isCorrectDecision = currentPuzzle.correct === decision.id;
                        return (
                          <button
                            key={decision.id}
                            onClick={() => handleDecision(decision.id)}
                            className={`flex w-full items-center gap-3 rounded-[10px] border px-4 py-3 text-left transition ${
                              isChosen
                                ? "border-[#2f63b8] bg-[#edf3ff]"
                                : isCorrectDecision && screen === "reveal"
                                  ? "border-emerald-200 bg-emerald-50"
                                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#2f63b8] text-sm font-bold text-white">
                              {decision.id}
                            </span>
                            <span className="text-base font-medium text-slate-700">
                              {decision.text}
                            </span>
                          </button>
                        );
                      })
                    : currentPuzzle.cluesRound2.map((clue) => {
                        const isSelected = selectedClue2?.title === clue.title;
                        return (
                          <button
                            key={clue.title}
                            onClick={() => handleRound2Choice(clue)}
                            className={`w-full rounded-[10px] border px-4 py-3 text-base font-medium transition ${
                              isSelected
                                ? "border-[#2f63b8] bg-[#edf3ff] text-[#244b8e]"
                                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            {clue.title}
                          </button>
                        );
                      })}
                </div>

                <ChoiceDivider label="or" />

                <div className="space-y-3">
                  {screen !== "reveal" && (
                    <button
                      onClick={() => setScreen("decision")}
                      className={buttonPrimaryClass}
                    >
                      Make the Call
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (screen === "decision" || screen === "reveal") {
                        setScreen("investigate2");
                        return;
                      }
                      setSelectedClue1(null);
                      setSelectedClue2(null);
                      setScreen("investigate1");
                    }}
                    className={buttonSecondaryClass}
                  >
                    {screen === "decision" || screen === "reveal"
                      ? "Review Clues"
                      : "Change First Clue"}
                  </button>
                </div>
              </>
            ) : (
              <div className="rounded-[20px] border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
                <div className="text-2xl font-semibold text-slate-700">
                  Choose a first clue
                </div>
                <p className="mx-auto mt-3 max-w-sm text-base leading-7 text-slate-500">
                  Your second round card will open here once you investigate the
                  case. This mirrors the side-by-side flow from your current UI.
                </p>
                <button
                  onClick={() =>
                    screen === "home" ? startPuzzle(currentPuzzleIndex) : setScreen("investigate1")
                  }
                  className={`mx-auto mt-6 block max-w-xs ${buttonPrimaryClass}`}
                >
                  Begin Investigation
                </button>
              </div>
            )}
          </section>

          <aside className={`${cardClass} self-start`}>
            <div className="text-center text-[2rem] font-semibold tracking-tight text-[#2f3f5f]">
              {screen === "reveal" ? "Case Review" : "Today&apos;s Case"}
            </div>

            <div className="mt-4 border-t border-slate-200 pt-4">
              {screen === "reveal" ? (
                <div className="space-y-5 text-[1rem]">
                  <div>
                    <div className="text-[1.35rem] font-semibold text-slate-800">
                      Your Clues:
                    </div>
                    <div className="mt-3 space-y-2 text-slate-700">
                      {selectedClueTitles.length > 0 ? (
                        selectedClueTitles.map((title) => (
                          <div key={title} className="flex items-start gap-2">
                            <span className="text-emerald-600">✓</span>
                            <span>{title}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-slate-500">No clues selected</div>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-4">
                    <div className="text-[1.35rem] font-semibold text-slate-800">
                      Right Answer:
                    </div>
                    <div className="mt-3 flex items-start gap-2 text-emerald-700">
                      <span>✓</span>
                      <span>{correctDecision?.text}</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-4">
                    <div className="text-[1.35rem] font-semibold text-slate-800">
                      Your Answer:
                    </div>
                    <div
                      className={`mt-3 flex items-start gap-2 ${
                        isCorrect ? "text-emerald-700" : "text-rose-700"
                      }`}
                    >
                      <span>{isCorrect ? "✓" : "!"}</span>
                      <span>{chosenDecision?.text}</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-4">
                    <div className="text-[1.35rem] font-semibold text-slate-800">
                      Compare to Other ER Docs:
                    </div>
                    <div className="mt-3 text-slate-700">
                      Your Score: Top {Math.max(3, 35 - score / 3)}%
                    </div>
                    <div className="mt-3 flex items-end gap-2">
                      {[11, 2, 3].map((value, index) => (
                        <div key={value} className="flex-1">
                          <div className="text-center text-xs text-slate-500">
                            {value}%
                          </div>
                          <div
                            className="mt-1 rounded-sm bg-[#9cb78d]"
                            style={{ height: `${20 + index * 8}px` }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {currentOutcome && (
                    <div className="border-t border-slate-200 pt-4 text-sm leading-6 text-slate-600">
                      {currentOutcome}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-5 text-[1rem]">
                  <div>
                    <div className="text-[1.35rem] font-semibold text-slate-800">
                      Your Clues:
                    </div>
                    <div className="mt-3 space-y-2 text-slate-700">
                      {currentPuzzle.cluesRound1.slice(0, 3).map((clue) => {
                        const active =
                          selectedClueTitles.includes(clue.title) ||
                          currentPuzzle.cluesRound2.some(
                            (round2) => round2.title === clue.title && selectedClueTitles.includes(round2.title)
                          );
                        return (
                          <div key={clue.title} className="flex items-start gap-2">
                            <span className={active ? "text-emerald-600" : "text-slate-300"}>
                              ✓
                            </span>
                            <span>{clue.title}</span>
                          </div>
                        );
                      })}
                      {selectedClue2 && (
                        <div className="flex items-start gap-2">
                          <span className="text-emerald-600">✓</span>
                          <span>{selectedClue2.title}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-4">
                    <div className="text-[1.35rem] font-semibold text-slate-800">
                      Focus:
                    </div>
                    <p className="mt-3 leading-7 text-slate-600">
                      {selectedClue1
                        ? selectedClue1.result
                        : "Pick one clue, then decide whether to investigate once more or make the call."}
                    </p>
                  </div>

                  {round2ResolvedText && (
                    <div className="border-t border-slate-200 pt-4">
                      <div className="text-[1.35rem] font-semibold text-slate-800">
                        Latest Insight:
                      </div>
                      <p className="mt-3 leading-7 text-slate-600">
                        {round2ResolvedText}
                      </p>
                    </div>
                  )}

                  <div className="border-t border-slate-200 pt-4">
                    <button
                      onClick={resetToHome}
                      className={buttonPrimaryClass}
                    >
                      Back to Home
                    </button>
                  </div>
                </div>
              )}
            </div>

            {screen === "reveal" && (
              <div className="mt-5 space-y-3 border-t border-slate-200 pt-5">
                <div
                  className={`rounded-full border px-4 py-2 text-center text-sm font-semibold ${getBadgeClasses(
                    scoreLabel
                  )}`}
                >
                  {scoreLabel} · {score} pts
                </div>
                <button onClick={resetCurrentPuzzle} className={buttonSecondaryClass}>
                  Play Again
                </button>
                {typedPuzzles.length > 1 && (
                  <button onClick={nextCase} className={buttonPrimaryClass}>
                    Next Case
                  </button>
                )}
              </div>
            )}
          </aside>
        </section>
      </div>
    </main>
  );
}
