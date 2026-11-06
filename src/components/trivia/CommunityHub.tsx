import * as React from "react";
import {
  type CommunityQuiz,
  type CommunityQuestion,
  FEATURED_COMMUNITY_QUIZZES,
  encodeQuizToHash,
  decodeQuizFromHash,
  loadUserQuizzes,
  saveUserQuiz,
  deleteUserQuiz,
} from "../../lib/trivia/community-data";
import { cn } from "@/lib/utils";

const LETTERS = ["A", "B", "C", "D"];

const EMPTY_QUESTION = (): CommunityQuestion => ({
  q: "",
  choices: ["", "", "", ""],
  answer: 0,
  why: "",
});

export default function CommunityHub({ siteEmail = "hello@triviaquestionsdigest.com" }: { siteEmail?: string }) {
  const [activeTab, setActiveTab] = React.useState<"explore" | "create">("explore");
  const [selectedTag, setSelectedTag] = React.useState<string>("all");
  const [userQuizzes, setUserQuizzes] = React.useState<CommunityQuiz[]>([]);
  const [activeQuiz, setActiveQuiz] = React.useState<CommunityQuiz | null>(null);

  // Play Mode State
  const [picked, setPicked] = React.useState<Record<number, number>>({});
  const [showShareToast, setShowShareToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState("");

  // Quiz Builder State
  const [builderTitle, setBuilderTitle] = React.useState("");
  const [builderCreator, setBuilderCreator] = React.useState("");
  const [builderTag, setBuilderTag] = React.useState("Pop Culture");
  const [builderDescription, setBuilderDescription] = React.useState("");
  const [builderQuestions, setBuilderQuestions] = React.useState<CommunityQuestion[]>([
    EMPTY_QUESTION(),
    EMPTY_QUESTION(),
    EMPTY_QUESTION(),
  ]);
  const [builderError, setBuilderError] = React.useState<string | null>(null);
  const [showSubmitModal, setShowSubmitModal] = React.useState(false);

  // Load user quizzes & handle hash-based shared quiz on mount
  React.useEffect(() => {
    setUserQuizzes(loadUserQuizzes());

    if (typeof window !== "undefined" && window.location.hash) {
      const decoded = decodeQuizFromHash(window.location.hash);
      if (decoded) {
        setActiveQuiz(decoded);
        triggerToast(`Loaded shared quiz: "${decoded.title}"`);
      }
    }
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3500);
  };

  const allQuizzes = React.useMemo(() => {
    return [...userQuizzes, ...FEATURED_COMMUNITY_QUIZZES];
  }, [userQuizzes]);

  const tags = React.useMemo(() => {
    const set = new Set(allQuizzes.map((q) => q.tag));
    return ["all", ...Array.from(set)];
  }, [allQuizzes]);

  const filteredQuizzes = React.useMemo(() => {
    if (selectedTag === "all") return allQuizzes;
    if (selectedTag === "mine") return userQuizzes;
    return allQuizzes.filter((q) => q.tag === selectedTag);
  }, [allQuizzes, selectedTag, userQuizzes]);

  // Quiz Builder Handlers
  const handleAddQuestion = () => {
    setBuilderQuestions((prev) => [...prev, EMPTY_QUESTION()]);
  };

  const handleRemoveQuestion = (idx: number) => {
    if (builderQuestions.length <= 1) {
      setBuilderError("A quiz must have at least one question.");
      return;
    }
    setBuilderQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleQuestionChange = (idx: number, field: keyof CommunityQuestion, value: any) => {
    setBuilderQuestions((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const handleChoiceChange = (qIdx: number, cIdx: number, value: string) => {
    setBuilderQuestions((prev) => {
      const copy = [...prev];
      const choices = [...copy[qIdx].choices] as [string, string, string, string];
      choices[cIdx] = value;
      copy[qIdx] = { ...copy[qIdx], choices };
      return copy;
    });
  };

  const validateBuilder = (): CommunityQuiz | null => {
    setBuilderError(null);
    if (!builderTitle.trim()) {
      setBuilderError("Please enter a title for your quiz.");
      return null;
    }
    if (!builderCreator.trim()) {
      setBuilderError("Please enter your name or creator nickname.");
      return null;
    }
    if (builderQuestions.length < 1) {
      setBuilderError("Please add at least one question.");
      return null;
    }

    for (let i = 0; i < builderQuestions.length; i++) {
      const q = builderQuestions[i];
      if (!q.q.trim()) {
        setBuilderError(`Question ${i + 1} is missing its question text.`);
        return null;
      }
      for (let j = 0; j < 4; j++) {
        if (!q.choices[j]?.trim()) {
          setBuilderError(`Question ${i + 1} is missing choice ${LETTERS[j]}.`);
          return null;
        }
      }
      if (!q.why?.trim()) {
        setBuilderError(`Question ${i + 1} is missing an explanation for the answer.`);
        return null;
      }
    }

    const quiz: CommunityQuiz = {
      id: `custom-${Date.now()}`,
      title: builderTitle.trim(),
      creator: builderCreator.trim(),
      tag: builderTag.trim() || "Custom",
      description: builderDescription.trim() || `Created by ${builderCreator.trim()} on Trivia Questions Digest.`,
      createdAt: new Date().toISOString().slice(0, 10),
      questions: builderQuestions,
    };
    return quiz;
  };

  const handleSaveAndPlay = () => {
    const quiz = validateBuilder();
    if (!quiz) return;

    saveUserQuiz(quiz);
    setUserQuizzes(loadUserQuizzes());
    setActiveQuiz(quiz);
    setPicked({});
    triggerToast("Quiz saved to your browser! Playing now.");
  };

  const handleCopyShareLink = (quiz: CommunityQuiz) => {
    const hash = encodeQuizToHash(quiz);
    const url = `${window.location.origin}/community/#quiz=${hash}`;
    navigator.clipboard.writeText(url).then(() => {
      triggerToast("Shareable link copied to clipboard! Anyone opening it can play your quiz.");
    });
  };

  const handleDeleteUserQuiz = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this custom quiz?")) {
      deleteUserQuiz(id);
      setUserQuizzes(loadUserQuizzes());
      triggerToast("Quiz deleted from your browser.");
    }
  };

  const handleOpenSubmitModal = () => {
    const quiz = validateBuilder();
    if (!quiz) return;
    setShowSubmitModal(true);
  };

  const buildSubmissionMailto = () => {
    const quiz = validateBuilder();
    if (!quiz) return "#";
    const subject = encodeURIComponent(`[Community Trivia Submission] ${quiz.title} by ${quiz.creator}`);
    const bodyText = `Hi Trivia Questions Digest Team,

I'd like to submit my custom trivia quiz to be featured in the official Community Quizzes section!

Quiz Title: ${quiz.title}
Creator Name: ${quiz.creator}
Category / Tag: ${quiz.tag}
Description: ${quiz.description}

Questions & Answers:
${quiz.questions
  .map(
    (q, i) =>
      `Q${i + 1}: ${q.q}
- A: ${q.choices[0]}${q.answer === 0 ? " (Correct)" : ""}
- B: ${q.choices[1]}${q.answer === 1 ? " (Correct)" : ""}
- C: ${q.choices[2]}${q.answer === 2 ? " (Correct)" : ""}
- D: ${q.choices[3]}${q.answer === 3 ? " (Correct)" : ""}
Explanation: ${q.why}
`
  )
  .join("\n")}

Shareable Link:
${typeof window !== "undefined" ? `${window.location.origin}/community/#quiz=${encodeQuizToHash(quiz)}` : ""}

Thanks!`;

    return `mailto:${siteEmail}?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
  };

  // Play Mode Calculations
  const answeredCount = Object.keys(picked).length;
  const correctCount = activeQuiz ? activeQuiz.questions.filter((q, i) => picked[i] === q.answer).length : 0;
  const isFinished = activeQuiz && answeredCount === activeQuiz.questions.length;

  return (
    <div className="relative">
      {/* Toast Notification */}
      {showShareToast && (
        <div className="bg-brand text-brand-foreground fixed right-4 bottom-6 z-50 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium shadow-lg transition-all animate-in fade-in slide-in-from-bottom-3">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Tabs Navigation */}
      <div className="flex border-b">
        <button
          type="button"
          onClick={() => {
            setActiveTab("explore");
            setActiveQuiz(null);
          }}
          className={cn(
            "flex items-center gap-2 border-b-2 px-6 py-3.5 text-sm font-bold transition-colors",
            activeTab === "explore"
              ? "border-brand text-brand"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <span>Community Quizzes</span>
          <span className="bg-muted text-foreground/80 rounded-full px-2 py-0.5 text-xs font-semibold">
            {allQuizzes.length}
          </span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("create");
            setActiveQuiz(null);
          }}
          className={cn(
            "flex items-center gap-2 border-b-2 px-6 py-3.5 text-sm font-bold transition-colors",
            activeTab === "create"
              ? "border-brand text-brand"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <span>+ Create Custom Trivia</span>
          <span className="bg-brand/15 text-brand rounded-full px-2 py-0.5 text-xs font-bold">New</span>
        </button>
      </div>

      {/* VIEW 1: ACTIVE QUIZ PLAY RUNNER */}
      {activeQuiz && (
        <div className="mt-8">
          <div className="bg-card flex flex-wrap items-center justify-between gap-4 rounded-xl border p-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-brand/10 text-brand rounded-md px-2.5 py-0.5 text-xs font-semibold uppercase">
                  {activeQuiz.tag}
                </span>
                {activeQuiz.isFeatured && (
                  <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-md px-2 py-0.5 text-xs font-semibold">
                    ★ Featured by Editors
                  </span>
                )}
              </div>
              <h2 className="mt-2 text-2xl font-extrabold">{activeQuiz.title}</h2>
              <p className="text-muted-foreground text-sm">
                Created by <strong className="text-foreground">{activeQuiz.creator}</strong> · {activeQuiz.questions.length} questions
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopyShareLink(activeQuiz)}
                className="bg-card hover:bg-accent rounded-lg border px-3.5 py-2 text-xs font-semibold"
              >
                Copy Share Link
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveQuiz(null);
                  setPicked({});
                }}
                className="bg-muted text-muted-foreground hover:text-foreground rounded-lg px-3.5 py-2 text-xs font-semibold"
              >
                Close & Return
              </button>
            </div>
          </div>

          {/* Sticky Score Banner */}
          <div className="bg-card/95 sticky top-16 z-20 mt-4 flex items-center justify-between rounded-xl border px-4 py-3 shadow-sm backdrop-blur-md">
            <p className="text-sm">
              <span className="num font-bold">{answeredCount}</span> of {activeQuiz.questions.length} answered ·{" "}
              <span className="num text-brand font-bold">{correctCount}</span> correct
            </p>
            <button
              type="button"
              onClick={() => setPicked({})}
              className="hover:bg-accent rounded-md border px-3 py-1.5 text-xs font-semibold"
            >
              Start Over
            </button>
          </div>

          {/* Quiz Completion Banner */}
          {isFinished && (
            <div className="border-brand/40 bg-brand/5 mt-6 rounded-2xl border p-6 text-center">
              <h3 className="text-xl font-extrabold">Round Complete!</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                You scored <strong className="text-foreground font-bold">{correctCount} out of {activeQuiz.questions.length}</strong> ({Math.round((correctCount / activeQuiz.questions.length) * 100)}%)
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => handleCopyShareLink(activeQuiz)}
                  className="bg-brand text-brand-foreground rounded-lg px-4 py-2 text-xs font-bold"
                >
                  Share This Quiz With Friends
                </button>
                <button
                  type="button"
                  onClick={() => setActiveQuiz(null)}
                  className="rounded-lg border px-4 py-2 text-xs font-bold"
                >
                  Play Another Quiz
                </button>
              </div>
            </div>
          )}

          {/* Questions List */}
          <ol className="mt-6 grid gap-4 !list-none !p-0">
            {activeQuiz.questions.map((q, idx) => {
              const userChoice = picked[idx];
              const isAnswered = userChoice !== undefined;
              const isRight = userChoice === q.answer;

              return (
                <li key={idx} className="bg-card rounded-xl border p-5">
                  <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                    Question {idx + 1}
                  </span>
                  <p className="mt-1 text-base font-semibold">{q.q}</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {q.choices.map((c, cIdx) => {
                      const isSelected = userChoice === cIdx;
                      const isCorrectChoice = cIdx === q.answer;

                      return (
                        <button
                          key={cIdx}
                          type="button"
                          disabled={isAnswered}
                          onClick={() => setPicked((prev) => ({ ...prev, [idx]: cIdx }))}
                          className={cn(
                            "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                            !isAnswered && "hover:border-brand/60",
                            isAnswered && isCorrectChoice && "border-emerald-500 bg-emerald-500/10 font-medium",
                            isAnswered && isSelected && !isCorrectChoice && "border-red-500 bg-red-500/10 line-through"
                          )}
                        >
                          <span
                            className={cn(
                              "grid size-6 shrink-0 place-items-center rounded-full border text-xs font-bold",
                              isAnswered && isCorrectChoice && "bg-emerald-500 text-white border-emerald-500",
                              isAnswered && isSelected && !isCorrectChoice && "bg-red-500 text-white border-red-500"
                            )}
                          >
                            {LETTERS[cIdx]}
                          </span>
                          <span className="flex-1">{c}</span>
                        </button>
                      );
                    })}
                  </div>

                  <details open={isAnswered} className="bg-muted/50 mt-3.5 rounded-lg px-4 py-3 text-xs leading-relaxed">
                    <summary className="cursor-pointer font-bold">
                      {isAnswered
                        ? isRight
                          ? "✓ Correct!"
                          : `✗ Answer: ${q.choices[q.answer]}`
                        : "Show Answer & Explanation"}
                    </summary>
                    <p className="mt-2 font-medium text-foreground">{q.why}</p>
                  </details>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {/* VIEW 2: EXPLORE COMMUNITY QUIZZES */}
      {!activeQuiz && activeTab === "explore" && (
        <div className="mt-8">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground mr-1 text-xs font-semibold">Filter:</span>
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors",
                  selectedTag === tag
                    ? "bg-brand text-brand-foreground border-brand font-bold"
                    : "bg-card text-muted-foreground hover:text-foreground"
                )}
              >
                {tag === "all" ? "All Quizzes" : tag}
              </button>
            ))}
            {userQuizzes.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedTag("mine")}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  selectedTag === "mine"
                    ? "bg-brand text-brand-foreground border-brand font-bold"
                    : "bg-card text-muted-foreground hover:text-foreground"
                )}
              >
                Created By Me ({userQuizzes.length})
              </button>
            )}
          </div>

          {/* Quizzes Grid */}
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredQuizzes.map((quiz) => {
              const isMine = userQuizzes.some((u) => u.id === quiz.id);

              return (
                <div
                  key={quiz.id}
                  onClick={() => {
                    setActiveQuiz(quiz);
                    setPicked({});
                  }}
                  className="group bg-card hover:border-brand/60 relative flex cursor-pointer flex-col justify-between rounded-xl border p-5 shadow-xs transition-all hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="bg-brand/10 text-brand rounded-md px-2 py-0.5 text-xs font-bold uppercase">
                        {quiz.tag}
                      </span>
                      {quiz.isFeatured && (
                        <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-md px-2 py-0.5 text-xs font-bold">
                          ★ Featured
                        </span>
                      )}
                      {isMine && (
                        <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-md px-2 py-0.5 text-xs font-bold">
                          Your Quiz
                        </span>
                      )}
                    </div>

                    <h3 className="group-hover:text-brand mt-3 text-lg font-bold transition-colors">
                      {quiz.title}
                    </h3>
                    <p className="text-muted-foreground mt-1.5 text-xs line-clamp-2 leading-relaxed">
                      {quiz.description}
                    </p>
                  </div>

                  <div className="border-border mt-4 border-t pt-3">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-muted-foreground">
                        by <strong className="text-foreground">{quiz.creator}</strong>
                      </span>
                      <span>{quiz.questions.length} questions</span>
                    </div>

                    <div className="mt-3 flex items-center justify-between pt-1">
                      <span className="text-brand group-hover:translate-x-0.5 font-bold transition-transform">
                        Play Quiz →
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyShareLink(quiz);
                          }}
                          title="Copy share link"
                          className="hover:bg-accent rounded-md border px-2 py-1 text-xs font-semibold"
                        >
                          Share
                        </button>
                        {isMine && (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteUserQuiz(quiz.id, e)}
                            title="Delete quiz from this browser"
                            className="text-red-500 hover:bg-red-500/10 rounded-md border border-red-500/30 px-2 py-1 text-xs font-semibold"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredQuizzes.length === 0 && (
            <div className="bg-card mt-8 rounded-xl border p-12 text-center">
              <p className="text-lg font-bold">No quizzes found in this category</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Be the first to create one! Click the "+ Create Custom Trivia" tab above.
              </p>
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: CREATE CUSTOM TRIVIA BUILDER */}
      {!activeQuiz && activeTab === "create" && (
        <div className="mt-8">
          <div className="bg-card rounded-xl border p-6 md:p-8">
            <h2 className="text-2xl font-extrabold">Build Your Custom Trivia Quiz</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Enter your information, draft questions with 4 choices, and set explanations. You can immediately test and play it, copy a shareable link for friends, or submit it to be officially published in our Community collection!
            </p>

            {builderError && (
              <div className="border-destructive/40 bg-destructive/10 text-destructive mt-4 rounded-lg border p-3.5 text-sm font-medium">
                {builderError}
              </div>
            )}

            {/* Quiz Metadata */}
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Quiz Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 90s Sitcom Classics, MCU Super-Quiz, Office Party Round"
                  value={builderTitle}
                  onChange={(e) => setBuilderTitle(e.target.value)}
                  className="border-input bg-background mt-1.5 h-10 w-full rounded-md border px-3 text-sm focus:border-brand focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Your Name / Nickname *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex M., Team Scranton, QuizMaster"
                  value={builderCreator}
                  onChange={(e) => setBuilderCreator(e.target.value)}
                  className="border-input bg-background mt-1.5 h-10 w-full rounded-md border px-3 text-sm focus:border-brand focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Topic / Tag
                </label>
                <select
                  value={builderTag}
                  onChange={(e) => setBuilderTag(e.target.value)}
                  className="border-input bg-background mt-1.5 h-10 w-full rounded-md border px-3 text-sm focus:border-brand focus:outline-hidden"
                >
                  <option value="Pop Culture">Pop Culture</option>
                  <option value="Movies & TV">Movies & TV</option>
                  <option value="Music">Music</option>
                  <option value="Gaming">Gaming</option>
                  <option value="History">History</option>
                  <option value="Science">Science</option>
                  <option value="Geography">Geography</option>
                  <option value="Food & Drink">Food & Drink</option>
                  <option value="Family & Friends">Family & Friends</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Short Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5 tricky questions about classic 90s TV shows"
                  value={builderDescription}
                  onChange={(e) => setBuilderDescription(e.target.value)}
                  className="border-input bg-background mt-1.5 h-10 w-full rounded-md border px-3 text-sm focus:border-brand focus:outline-hidden"
                />
              </div>
            </div>

            {/* Questions Section */}
            <div className="mt-8 border-t pt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Questions ({builderQuestions.length})</h3>
                <span className="text-xs text-muted-foreground">Radio button selects the correct answer</span>
              </div>

              <div className="mt-4 grid gap-6">
                {builderQuestions.map((q, qIdx) => (
                  <div key={qIdx} className="bg-muted/30 rounded-xl border p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-brand">
                        Question {qIdx + 1}
                      </span>
                      {builderQuestions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(qIdx)}
                          className="text-muted-foreground hover:text-red-500 text-xs font-semibold"
                        >
                          ✕ Remove Question
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      placeholder={`Enter question prompt... (e.g. In what year did...?)`}
                      value={q.q}
                      onChange={(e) => handleQuestionChange(qIdx, "q", e.target.value)}
                      className="border-input bg-background mt-2 h-10 w-full rounded-md border px-3 text-sm focus:border-brand focus:outline-hidden font-medium"
                    />

                    {/* Choices Grid */}
                    <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                      {LETTERS.map((letter, cIdx) => (
                        <div key={cIdx} className="flex items-center gap-2">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name={`correct-${qIdx}`}
                              checked={q.answer === cIdx}
                              onChange={() => handleQuestionChange(qIdx, "answer", cIdx)}
                              className="accent-brand size-4 cursor-pointer"
                            />
                            <span className="grid size-6 place-items-center rounded-md border text-xs font-bold bg-background">
                              {letter}
                            </span>
                          </label>
                          <input
                            type="text"
                            placeholder={`Choice ${letter}${q.answer === cIdx ? " (Correct Answer)" : ""}`}
                            value={q.choices[cIdx]}
                            onChange={(e) => handleChoiceChange(qIdx, cIdx, e.target.value)}
                            className={cn(
                              "border-input bg-background h-9 flex-1 rounded-md border px-2.5 text-xs focus:border-brand focus:outline-hidden",
                              q.answer === cIdx && "border-brand ring-1 ring-brand/30 font-medium"
                            )}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Explanation */}
                    <div className="mt-3">
                      <label className="text-xs font-semibold text-muted-foreground">
                        Explanation (shown to players after answering)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. This happened during the 1996 season because..."
                        value={q.why}
                        onChange={(e) => handleQuestionChange(qIdx, "why", e.target.value)}
                        className="border-input bg-background mt-1 h-9 w-full rounded-md border px-2.5 text-xs focus:border-brand focus:outline-hidden"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddQuestion}
                className="hover:bg-accent mt-4 w-full rounded-xl border-2 border-dashed py-3 text-center text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
              >
                + Add Another Question
              </button>
            </div>

            {/* Builder Action Toolbar */}
            <div className="border-border mt-8 flex flex-wrap items-center justify-between gap-4 border-t pt-6">
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleSaveAndPlay}
                  className="bg-brand text-brand-foreground rounded-lg px-5 py-2.5 text-sm font-bold shadow-xs hover:opacity-90"
                >
                  Play & Test Quiz
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const quiz = validateBuilder();
                    if (!quiz) return;
                    saveUserQuiz(quiz);
                    setUserQuizzes(loadUserQuizzes());
                    handleCopyShareLink(quiz);
                  }}
                  className="bg-card hover:bg-accent rounded-lg border px-4 py-2.5 text-sm font-bold"
                >
                  Copy Shareable Link
                </button>
              </div>

              <button
                type="button"
                onClick={handleOpenSubmitModal}
                className="bg-accent text-foreground hover:border-brand rounded-lg border px-4 py-2.5 text-sm font-bold"
              >
                Submit for Site Publication →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBMISSION MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-card max-w-lg w-full rounded-2xl border p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-xl font-extrabold">Submit Quiz to Community Showcase</h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              We review community-submitted quizzes to check for factual accuracy, clean options, and family-friendly content before officially publishing them in our permanent Community Collection.
            </p>

            <div className="bg-muted/50 mt-4 rounded-xl p-4 text-xs">
              <p><strong>Title:</strong> {builderTitle}</p>
              <p><strong>Author:</strong> {builderCreator}</p>
              <p><strong>Questions:</strong> {builderQuestions.length} questions</p>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <a
                href={buildSubmissionMailto()}
                className="bg-brand text-brand-foreground rounded-lg py-2.5 text-center text-sm font-bold no-underline hover:opacity-90"
              >
                Send via Email (Pre-filled Draft)
              </a>
              <button
                type="button"
                onClick={() => {
                  const quiz = validateBuilder();
                  if (quiz) {
                    navigator.clipboard.writeText(JSON.stringify(quiz, null, 2));
                    triggerToast("Quiz JSON copied to clipboard!");
                  }
                }}
                className="rounded-lg border py-2 text-xs font-semibold"
              >
                Copy Quiz Payload JSON
              </button>
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="text-muted-foreground hover:text-foreground text-xs font-semibold mt-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
