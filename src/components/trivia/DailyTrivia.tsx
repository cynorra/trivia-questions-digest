import * as React from "react";
import { cn } from "@/lib/utils";
import { dayNumber, dayKey, dailyIndices } from "./daily-core";

type Q = { id: string; q: string; choices: string[]; answer: number; why: string; cat: string };
const LETTERS = ["A", "B", "C", "D"];
const fmt = (k: string) => new Date(`${k}T12:00:00Z`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

/** Today's ten questions, the same for every player, with answers saved in the browser. */
export default function DailyTrivia({ buildTime, pool, site, url }: { buildTime: number; pool: Q[]; site: string; url: string }) {
  const [n, setN] = React.useState(dayNumber(buildTime));
  const qs = React.useMemo(() => dailyIndices(n, pool.length).map((i) => pool[i]), [n]);
  const [picked, setPicked] = React.useState<Record<number, number>>({});
  const [copied, setCopied] = React.useState(false);
  const key = `dtq-${dayKey(n)}`;

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
    const text = `${site} #${n}: ${right}/10\n${qs.map((q, i) => (picked[i] === q.answer ? "🟩" : "🟥")).join("")}\n${url}`;
    try { await navigator.clipboard.writeText(text); setCopied(true); } catch { setCopied(false); }
  };

  return (
    <div className="grid gap-4">
      <div className="bg-card sticky top-16 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 shadow-sm">
        <p className="text-sm"><span className="font-semibold">Quiz #{n}</span> · <time dateTime={dayKey(n)}>{fmt(dayKey(n))}</time> · <span className="num">{answered}</span>/10 answered · <span className="num text-brand font-semibold">{right}</span> correct</p>
        {done && <button type="button" onClick={share} className="bg-brand text-brand-foreground rounded-md px-3 py-1.5 text-sm font-semibold">{copied ? "Copied" : "Copy result"}</button>}
      </div>
      <ol className="!m-0 grid !list-none gap-4 !p-0">
        {qs.map((q, i) => {
          const p = picked[i];
          const a = p !== undefined;
          return (
            <li key={`${n}-${q.id}`} className="bg-card rounded-xl border p-4 md:p-5">
              <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">Question {i + 1} of 10 · {q.cat}</p>
              <p className="font-medium">{q.q}</p>
              <div role="radiogroup" aria-label={`Question ${i + 1} choices`} className="mt-3 grid gap-2 sm:grid-cols-2">
                {q.choices.map((c, j) => (
                  <button key={j} type="button" role="radio" aria-checked={p === j} disabled={a} onClick={() => pick(i, j)}
                    className={cn("flex items-center gap-3 rounded-lg border px-3 py-2 text-left", !a && "hover:border-brand", a && j === q.answer && "border-hit bg-hit/10", a && p === j && j !== q.answer && "border-destructive bg-destructive/10")}>
                    <span className="grid size-6 shrink-0 place-items-center rounded-full border text-xs font-semibold">{LETTERS[j]}</span>{c}
                  </button>
                ))}
              </div>
              {a && (
                <div className="bg-muted/60 mt-3 rounded-lg px-4 py-3 text-sm">
                  <p className={cn("font-semibold", p === q.answer ? "text-hit" : "text-destructive")}>{p === q.answer ? "Correct." : `The answer is ${q.choices[q.answer]}.`}</p>
                  <p className="mt-1">{q.why}</p>
                </div>
              )}
            </li>
          );
        })}
      </ol>
      {done && (
        <div className="bg-brand-soft rounded-xl p-5 text-center">
          <p className="font-display text-2xl font-bold">{right} of 10 today.</p>
          <p className="text-muted-foreground mt-1">{right >= 8 ? "Excellent. " : right >= 5 ? "A solid score. " : "Tomorrow's another chance. "}A new quiz starts at midnight UTC.</p>
        </div>
      )}
    </div>
  );
}
