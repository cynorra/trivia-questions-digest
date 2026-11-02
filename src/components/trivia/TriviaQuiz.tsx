import * as React from "react";
import { cn } from "@/lib/utils";

type T = { id: string; q: string; choices: string[]; answer: number; why: string };
const LETTERS = ["A", "B", "C", "D"];

/** Hand-written questions; every explanation is in the page (closed) so it reads without JavaScript. */
export default function TriviaQuiz({ questions }: { questions: T[] }) {
  const [picked, setPicked] = React.useState<Record<string, number>>({});
  const answered = Object.keys(picked).length;
  const right = questions.filter((q) => picked[q.id] === q.answer).length;
  return (
    <div className="grid gap-4">
      <div className="bg-card sticky top-16 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 shadow-sm">
        <p className="text-sm" aria-live="polite"><span className="num font-semibold">{answered}</span> of {questions.length} answered · <span className="num text-brand font-semibold">{right}</span> correct</p>
        <button type="button" onClick={() => setPicked({})} className="rounded-md border px-3 py-1.5 text-sm">Start over</button>
      </div>
      <ol className="!m-0 grid !list-none gap-4 !p-0">
        {questions.map((q, n) => {
          const p = picked[q.id];
          const a = p !== undefined;
          return (
            <li key={q.id} className="bg-card rounded-xl border p-4 md:p-5">
              <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">Question {n + 1}</p>
              <p className="font-medium">{q.q}</p>
              <div role="radiogroup" aria-label={`Question ${n + 1} choices`} className="mt-3 grid gap-2 sm:grid-cols-2">
                {q.choices.map((c, i) => (
                  <button key={i} type="button" role="radio" aria-checked={p === i} disabled={a} onClick={() => setPicked((o) => ({ ...o, [q.id]: i }))}
                    className={cn("flex items-center gap-3 rounded-lg border px-3 py-2 text-left", !a && "hover:border-brand", a && i === q.answer && "border-hit bg-hit/10", a && p === i && i !== q.answer && "border-destructive bg-destructive/10")}>
                    <span className="grid size-6 shrink-0 place-items-center rounded-full border text-xs font-semibold">{LETTERS[i]}</span>{c}
                  </button>
                ))}
              </div>
              <details open={a} className="bg-muted/60 mt-3 rounded-lg px-4 py-3 text-sm">
                <summary className="cursor-pointer font-semibold">{a ? (p === q.answer ? "Correct" : `Answer: ${q.choices[q.answer]}`) : "Show answer"}</summary>
                {!a && <p className="mt-2 font-semibold">{q.choices[q.answer]}</p>}
                <p className="mt-1">{q.why}</p>
              </details>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
