import * as React from "react";
import { cn } from "@/lib/utils";
import { makeRound, type Item } from "./ChoiceQuiz.tsx";

const LETTERS = ["A", "B", "C", "D"];
const EPOCH = Date.UTC(2026, 10, 2); // Challenge #1 = 2 November 2026 (UTC)
const dayNumber = (t: number) => Math.floor((t - EPOCH) / 864e5) + 1;
const dayKey = (n: number) => new Date(EPOCH + (n - 1) * 864e5).toISOString().slice(0, 10);

/** Ten questions for day n, the same for every player: 3 flags, 3 capitals, 2 shapes, 2 state capitals. */
function build(n: number, countries: Item[], capitals: Item[], outlines: Item[], states: Item[]) {
  const s = 7919 * n;
  return [
    ...makeRound(countries, "flag", s + 1, 3),
    ...makeRound(capitals, "capital", s + 2, 3),
    ...makeRound(outlines, "outline", s + 3, 2),
    ...makeRound(states, "state-capital", s + 4, 2),
  ];
}

export default function Daily({ buildTime, countries, capitals, outlines, states, site, url }: { buildTime: number; countries: Item[]; capitals: Item[]; outlines: Item[]; states: Item[]; site: string; url: string }) {
  const [n, setN] = React.useState(dayNumber(buildTime));
  const qs = React.useMemo(() => build(n, countries, capitals, outlines, states), [n]);
  const [picked, setPicked] = React.useState<Record<number, number>>({});
  const [copied, setCopied] = React.useState(false);
  const key = `dtq-geo-${dayKey(n)}`;

  React.useEffect(() => {
    const today = dayNumber(Date.now());
    if (today !== n) { setN(today); setPicked({}); return; }
    try { const saved = localStorage.getItem(key); if (saved) setPicked(JSON.parse(saved)); } catch {}
  }, [n]);
  const pick = (i: number, c: number) => setPicked((o) => { const next = { ...o, [i]: c }; try { localStorage.setItem(key, JSON.stringify(next)); } catch {} return next; });

  const answered = Object.keys(picked).length;
  const right = qs.filter((q, i) => picked[i] === q.answer).length;
  const done = answered === qs.length;
  const share = async () => {
    const text = `${site} geography #${n}: ${right}/10\n${qs.map((q, i) => (picked[i] === q.answer ? "🟩" : "🟥")).join("")}\n${url}`;
    try { await navigator.clipboard.writeText(text); setCopied(true); } catch { setCopied(false); }
  };

  return (
    <div className="grid gap-4">
      <div className="bg-card sticky top-16 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 shadow-sm">
        <p className="text-sm"><span className="font-semibold">Challenge #{n}</span> · {dayKey(n)} · <span className="num">{answered}</span>/10 answered · <span className="num text-brand font-semibold">{right}</span> correct</p>
        {done && <button type="button" onClick={share} className="bg-brand text-brand-foreground rounded-md px-3 py-1.5 text-sm font-semibold">{copied ? "Copied" : "Copy result"}</button>}
      </div>
      <ol className="!m-0 grid !list-none gap-4 !p-0">
        {qs.map((q, i) => {
          const p = picked[i];
          const a = p !== undefined;
          return (
            <li key={`${n}-${i}`} className="bg-card rounded-xl border p-4 md:p-5">
              <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">Question {i + 1} of 10</p>
              <p className="font-medium">{q.prompt}</p>
              {q.img && <img src={q.img} alt="Image to identify" width="160" height="120" loading="lazy" className={cn("mt-3 h-28 w-auto rounded border", q.img.includes("outlines") && "bg-muted p-2 dark:invert")} />}
              <div role="radiogroup" aria-label={`Question ${i + 1} choices`} className="mt-3 grid gap-2 sm:grid-cols-2">
                {q.choices.map((c, j) => (
                  <button key={j} type="button" role="radio" aria-checked={p === j} disabled={a} onClick={() => pick(i, j)}
                    className={cn("flex items-center gap-3 rounded-lg border px-3 py-2 text-left", !a && "hover:border-brand", a && j === q.answer && "border-hit bg-hit/10", a && p === j && j !== q.answer && "border-destructive bg-destructive/10")}>
                    <span className="grid size-6 shrink-0 place-items-center rounded-full border text-xs font-semibold">{LETTERS[j]}</span>{c}
                  </button>
                ))}
              </div>
              {a && <p className={cn("mt-3 text-sm font-semibold", p === q.answer ? "text-hit" : "text-destructive")}>{p === q.answer ? "Correct." : `The answer is ${q.choices[q.answer]}.`} {q.note && <span className="text-muted-foreground font-normal">{q.note}</span>}</p>}
            </li>
          );
        })}
      </ol>
      {done && <div className="bg-brand-soft rounded-xl p-5 text-center"><p className="font-display text-2xl font-bold">{right} of 10 today.</p><p className="text-muted-foreground mt-1">A new challenge starts at midnight UTC.</p></div>}
    </div>
  );
}
