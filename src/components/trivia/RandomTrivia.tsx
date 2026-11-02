import * as React from "react";
import { cn } from "@/lib/utils";

type Q = { id: string; q: string; choices: string[]; answer: number; why: string; cat: string };
const LETTERS = ["A", "B", "C", "D"];

/** One random question at a time from the whole library, optionally from one category. */
export default function RandomTrivia({ questions, cats }: { questions: Q[]; cats: string[] }) {
  const [cat, setCat] = React.useState<string>("All");
  const pool = React.useMemo(() => (cat === "All" ? questions : questions.filter((q) => q.cat === cat)), [cat]);
  const [i, setI] = React.useState(0);
  const [p, setP] = React.useState<number | undefined>(undefined);
  const [score, setScore] = React.useState({ right: 0, seen: 0 });
  const seen = React.useRef<Set<string>>(new Set());
  const q = pool[i % pool.length];

  const next = () => {
    let j = Math.floor(Math.random() * pool.length);
    for (let t = 0; t < 20 && seen.current.has(pool[j].id); t++) j = Math.floor(Math.random() * pool.length);
    if (seen.current.size >= pool.length - 1) seen.current.clear();
    seen.current.add(pool[j].id);
    setI(j); setP(undefined);
  };
  const choose = (c: number) => { if (p !== undefined) return; setP(c); setScore((s) => ({ right: s.right + (c === q.answer ? 1 : 0), seen: s.seen + 1 })); };
  React.useEffect(() => { next(); }, [cat]);

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Category">
        {["All", ...cats].map((c) => (
          <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)} className={cn("rounded-full border px-3 py-1 text-sm", cat === c && "bg-brand text-brand-foreground border-brand")}>{c}</button>
        ))}
      </div>
      <div className="bg-card rounded-xl border p-5 md:p-6">
        <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">{q.cat}</p>
        <p className="font-display text-xl leading-snug font-bold">{q.q}</p>
        <div role="radiogroup" aria-label="Choices" className="mt-4 grid gap-2 sm:grid-cols-2">
          {q.choices.map((c, j) => (
            <button key={j} type="button" role="radio" aria-checked={p === j} disabled={p !== undefined} onClick={() => choose(j)}
              className={cn("flex items-center gap-3 rounded-lg border px-3 py-2 text-left", p === undefined && "hover:border-brand", p !== undefined && j === q.answer && "border-hit bg-hit/10", p === j && j !== q.answer && "border-destructive bg-destructive/10")}>
              <span className="grid size-6 shrink-0 place-items-center rounded-full border text-xs font-semibold">{LETTERS[j]}</span>{c}
            </button>
          ))}
        </div>
        {p !== undefined && (
          <div className="bg-muted/60 mt-4 rounded-lg px-4 py-3 text-sm">
            <p className={cn("font-semibold", p === q.answer ? "text-hit" : "text-destructive")}>{p === q.answer ? "Correct." : `The answer is ${q.choices[q.answer]}.`}</p>
            <p className="mt-1">{q.why}</p>
          </div>
        )}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-muted-foreground text-sm" aria-live="polite"><span className="num text-brand font-semibold">{score.right}</span> of <span className="num">{score.seen}</span> right this session</p>
          <button type="button" onClick={next} className="bg-brand text-brand-foreground rounded-lg px-5 py-2 font-semibold">Next question</button>
        </div>
      </div>
    </div>
  );
}
