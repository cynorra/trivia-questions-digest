import * as React from "react";
import { cn } from "@/lib/utils";
import { QUESTIONS, ANIMALS, result } from "@/lib/trivia/spirit-animal.js";

const LETTERS = ["A", "B", "C", "D"];

/** Ten questions, then your best match and runner-up. Nothing is stored or sent anywhere. */
export default function SpiritAnimalQuiz() {
  const [picks, setPicks] = React.useState<(number | null)[]>(() => QUESTIONS.map(() => null));
  const answered = picks.filter((p) => p !== null).length;
  const done = answered === QUESTIONS.length;
  const res = done ? result(picks) : null;
  const top = res ? (ANIMALS as any)[res.top] : null;
  const second = res ? (ANIMALS as any)[res.second] : null;
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => { if (done) ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, [done]);

  return (
    <div className="grid gap-4">
      <div className="bg-card sticky top-16 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 shadow-sm">
        <p className="text-sm"><span className="num font-semibold">{answered}</span> of {QUESTIONS.length} answered</p>
        <button type="button" onClick={() => setPicks(QUESTIONS.map(() => null))} className="rounded-md border px-3 py-1.5 text-sm">Start over</button>
      </div>
      <ol className="!m-0 grid !list-none gap-4 !p-0">
        {QUESTIONS.map(([q, opts], i) => (
          <li key={i} className="bg-card rounded-xl border p-4 md:p-5">
            <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">Question {i + 1}</p>
            <p className="font-medium">{q as string}</p>
            <div role="radiogroup" aria-label={`Question ${i + 1} choices`} className="mt-3 grid gap-2 sm:grid-cols-2">
              {(opts as any[]).map(([label], j) => (
                <button key={j} type="button" role="radio" aria-checked={picks[i] === j} onClick={() => setPicks((p) => p.map((x, k) => (k === i ? j : x)))}
                  className={cn("flex items-center gap-3 rounded-lg border px-3 py-2 text-left", picks[i] === j ? "border-brand bg-brand-soft" : "hover:border-brand")}>
                  <span className="grid size-6 shrink-0 place-items-center rounded-full border text-xs font-semibold">{LETTERS[j]}</span>{label}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ol>
      <div ref={ref} className="scroll-mt-24">
        {top && second && (
          <div className="bg-brand-soft rounded-xl border p-5 md:p-6" aria-live="polite">
            <p className="text-sm font-semibold tracking-wider uppercase">Your spirit animal</p>
            <p className="font-display mt-1 text-3xl font-extrabold">{top.name}</p>
            <p className="mt-1 font-medium">{top.tagline}</p>
            <p className="mt-3">{top.traits}</p>
            <p className="mt-3 text-sm"><strong>Strengths:</strong> {top.strengths.join(" · ")}</p>
            <p className="mt-1 text-sm"><strong>Watch out for:</strong> {top.watch}</p>
            <p className="text-muted-foreground mt-4 text-sm">Runner-up: <strong className="text-foreground">{second.name}</strong>, {second.tagline.toLowerCase()}.</p>
          </div>
        )}
        {!done && <p className="text-muted-foreground text-sm">Answer all {QUESTIONS.length} questions to see your result.</p>}
      </div>
    </div>
  );
}
