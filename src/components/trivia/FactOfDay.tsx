import * as React from "react";
import { dayNumber, factIndex } from "./daily-core";

type F = [string, string, string, string];

/** One fun fact per day, chosen by the same calendar as the daily quiz. */
export default function FactOfDay({ buildTime, facts, compact = false }: { buildTime: number; facts: F[]; compact?: boolean }) {
  const [n, setN] = React.useState(dayNumber(buildTime));
  React.useEffect(() => { const t = dayNumber(Date.now()); if (t !== n) setN(t); }, []);
  const [, fact, why, src] = facts[factIndex(n, facts.length)];
  return (
    <div className="bg-note text-note-foreground rounded-xl border p-5 md:p-6">
      <p className="text-xs font-semibold tracking-wider uppercase">Fact of the day</p>
      <p className="font-display mt-2 text-xl leading-snug font-bold md:text-2xl">{fact}</p>
      {!compact && <p className="mt-2">{why}</p>}
      <p className="mt-2 text-sm opacity-80">Source: {src}</p>
    </div>
  );
}
