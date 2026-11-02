import * as React from "react";
import { cn } from "@/lib/utils";

export type Item = { id: string; name: string; capital?: string; group?: string; note?: string };
type Mode = "capital" | "country-of-capital" | "flag" | "outline" | "state-capital";
type Q = { id: string; prompt: string; img?: string; choices: string[]; answer: number; note?: string };

const LETTERS = ["A", "B", "C", "D"];
function rng(seed: number) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function shuffle<T>(a: T[], r: () => number) { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }

/** Build a round of questions; distractors come from the same group (continent or region). */
export function makeRound(items: Item[], mode: Mode, seed: number, n: number): Q[] {
  const r = rng(seed);
  const field = (it: Item) => (mode === "capital" || mode === "state-capital" ? it.capital! : it.name);
  const picks = shuffle(items, r).slice(0, n);
  return picks.map((it) => {
    const same = items.filter((o) => o.id !== it.id && o.group === it.group && field(o) !== field(it));
    const others = items.filter((o) => o.id !== it.id && o.group !== it.group);
    const wrong = [...shuffle(same, r), ...shuffle(others, r)].slice(0, 3).map(field);
    const choices = shuffle([field(it), ...wrong], r);
    const prompt =
      mode === "capital" ? `What is the capital of ${it.name}?`
      : mode === "state-capital" ? `What is the capital of ${it.name}?`
      : mode === "country-of-capital" ? `${it.capital} is the capital of which country?`
      : mode === "flag" ? "Which country does this flag belong to?"
      : "Which country has this shape?";
    const img = mode === "flag" ? `/flags/${it.id}.svg` : mode === "outline" ? `/outlines/${it.id}.svg` : undefined;
    return { id: it.id, prompt, img, choices, answer: choices.indexOf(field(it)), note: it.note };
  });
}

export default function ChoiceQuiz({ items, mode, groups = [], round = 10, label }: { items: Item[]; mode: Mode; groups?: { key: string; label: string }[]; round?: number; label: string }) {
  const [group, setGroup] = React.useState("all");
  const [size, setSize] = React.useState(round);
  const pool = group === "all" ? items : items.filter((i) => i.group === group);
  const [qs, setQs] = React.useState<Q[]>(() => makeRound(items, mode, 1, round));
  const [picked, setPicked] = React.useState<Record<number, number>>({});
  const newRound = (g = group, n = size) => {
    const p = g === "all" ? items : items.filter((i) => i.group === g);
    setQs(makeRound(p, mode, Math.floor(Math.random() * 1e9), Math.min(n, p.length)));
    setPicked({});
  };
  const answered = Object.keys(picked).length;
  const right = qs.filter((q, i) => picked[i] === q.answer).length;

  return (
    <div className="grid gap-4">
      <div className="bg-card sticky top-16 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 shadow-sm">
        <p className="text-sm" aria-live="polite"><span className="num font-semibold">{answered}</span> of {qs.length} answered · <span className="num text-brand font-semibold">{right}</span> correct</p>
        <div className="flex flex-wrap gap-2 text-sm">
          {groups.length > 0 && (
            <select aria-label="Region" value={group} onChange={(e) => { setGroup(e.target.value); newRound(e.target.value); }} className="bg-background rounded-md border px-2 py-1.5">
              <option value="all">All {label}</option>
              {groups.map((g) => <option key={g.key} value={g.key}>{g.label}</option>)}
            </select>
          )}
          <select aria-label="Questions per round" value={size} onChange={(e) => { const n = Number(e.target.value); setSize(n); newRound(group, n); }} className="bg-background rounded-md border px-2 py-1.5">
            <option value={10}>10 questions</option>
            <option value={pool.length}>All {pool.length}</option>
          </select>
          <button type="button" onClick={() => newRound()} className="bg-brand text-brand-foreground rounded-md px-3 py-1.5 font-semibold">New round</button>
        </div>
      </div>
      <ol className="!m-0 grid !list-none gap-4 !p-0">
        {qs.map((q, n) => {
          const p = picked[n];
          const done = p !== undefined;
          return (
            <li key={`${q.id}-${n}`} className="bg-card rounded-xl border p-4 md:p-5">
              <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">Question {n + 1}</p>
              <p className="font-medium">{q.prompt}</p>
              {q.img && <img src={q.img} alt={mode === "flag" ? "Flag to identify" : "Country outline to identify"} width="160" height="120" loading="lazy" className={cn("mt-3 h-28 w-auto rounded border", mode === "outline" && "bg-muted p-2 dark:invert")} />}
              <div role="radiogroup" aria-label={`Question ${n + 1} choices`} className="mt-3 grid gap-2 sm:grid-cols-2">
                {q.choices.map((c, i) => (
                  <button key={i} type="button" role="radio" aria-checked={p === i} disabled={done} onClick={() => setPicked((o) => ({ ...o, [n]: i }))}
                    className={cn("flex items-center gap-3 rounded-lg border px-3 py-2 text-left", !done && "hover:border-brand", done && i === q.answer && "border-hit bg-hit/10", done && p === i && i !== q.answer && "border-destructive bg-destructive/10")}>
                    <span className="grid size-6 shrink-0 place-items-center rounded-full border text-xs font-semibold">{LETTERS[i]}</span>{c}
                  </button>
                ))}
              </div>
              {done && <p className={cn("mt-3 text-sm font-semibold", p === q.answer ? "text-hit" : "text-destructive")}>{p === q.answer ? "Correct." : `The answer is ${q.choices[q.answer]}.`} {q.note && <span className="text-muted-foreground font-normal">{q.note}</span>}</p>}
            </li>
          );
        })}
      </ol>
      {answered === qs.length && (
        <div className="bg-brand-soft rounded-xl p-5 text-center">
          <p className="font-display text-2xl font-bold">You got {right} of {qs.length}.</p>
          <button type="button" onClick={() => newRound()} className="bg-brand text-brand-foreground mt-3 rounded-md px-4 py-2 font-semibold">Play another round</button>
        </div>
      )}
    </div>
  );
}
