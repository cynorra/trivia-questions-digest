import * as React from "react";
import { cn } from "@/lib/utils";

type Target = { id: string; name: string; group?: string };
type Filter = { key: string; label: string };

const shuffle = <T,>(a: T[]) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const fmt = (ms: number) => { const s = Math.floor(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };

/**
 * Click-the-map quiz. The map itself is static SVG (MapSvg.astro); this island
 * asks for one place at a time, colors answers and keeps score. Three wrong
 * clicks reveal the answer and count it as missed.
 */
export default function MapQuiz({ mapId, targets, plural = "places", filters = [] }: { mapId: string; targets: Target[]; plural?: string; filters?: Filter[] }) {
  const [status, setStatus] = React.useState<"idle" | "playing" | "done">("idle");
  const [group, setGroup] = React.useState<string>("all");
  const [order, setOrder] = React.useState<Target[]>([]);
  const [idx, setIdx] = React.useState(0);
  const [tries, setTries] = React.useState(0);
  const [results, setResults] = React.useState<Record<string, "ok" | "miss">>({});
  const [msg, setMsg] = React.useState<string>("");
  const [study, setStudy] = React.useState(false);
  const [zoom, setZoom] = React.useState(false);
  const [t0, setT0] = React.useState(0);
  const [now, setNow] = React.useState(0);

  const svg = () => document.getElementById(mapId) as SVGSVGElement | null;
  const els = (id: string) => Array.from(svg()?.querySelectorAll(`[data-id="${id}"]`) ?? []);
  const pool = group === "all" ? targets : targets.filter((t) => t.group === group);
  const current = order[idx];

  React.useEffect(() => { svg()?.classList.toggle("show-labels", study); }, [study]);
  React.useEffect(() => { svg()?.parentElement?.classList.toggle("zoomed", zoom); }, [zoom]);
  React.useEffect(() => {
    if (status !== "playing") return;
    const h = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(h);
  }, [status]);
  React.useEffect(() => {
    const s = svg();
    if (!s) return;
    s.querySelectorAll("[data-id]").forEach((el) => el.classList.toggle("dim", status === "playing" && !pool.some((p) => p.id === el.getAttribute("data-id"))));
  }, [status, group]);

  const clearMap = () => svg()?.querySelectorAll(".ok,.miss,.flash,.reveal").forEach((el) => el.classList.remove("ok", "miss", "flash", "reveal"));
  const start = () => {
    clearMap();
    setOrder(shuffle(pool)); setIdx(0); setTries(0); setResults({}); setMsg("");
    setT0(Date.now()); setNow(Date.now()); setStatus("playing");
  };
  const advance = (res: "ok" | "miss", target: Target) => {
    const next = { ...results, [target.id]: res };
    setResults(next);
    els(target.id).forEach((el) => el.classList.add(res));
    setTries(0);
    if (idx + 1 >= order.length) { setStatus("done"); setNow(Date.now()); } else setIdx(idx + 1);
  };

  React.useEffect(() => {
    const s = svg();
    if (!s) return;
    const onClick = (e: Event) => {
      const el = (e.target as Element).closest("[data-id]");
      if (!el) return;
      const id = el.getAttribute("data-id")!;
      const name = el.getAttribute("data-name") ?? "";
      if (status !== "playing") { setMsg(name); return; }
      if (!current || results[id]) return;
      if (id === current.id) { setMsg(tries === 0 ? `Yes, ${current.name}.` : `${current.name}, on try ${tries + 1}.`); advance(tries === 0 ? "ok" : "miss", current); return; }
      if (!pool.some((p) => p.id === id)) return;
      el.classList.add("flash"); setTimeout(() => el.classList.remove("flash"), 700);
      const t = tries + 1;
      if (t >= 3) {
        els(current.id).forEach((x) => x.classList.add("reveal"));
        setMsg(`That's ${name}. ${current.name} is highlighted.`);
        advance("miss", current);
      } else { setTries(t); setMsg(`That's ${name}. Try again.`); }
    };
    s.addEventListener("click", onClick);
    return () => s.removeEventListener("click", onClick);
  });

  const okCount = Object.values(results).filter((r) => r === "ok").length;
  const done = Object.keys(results).length;
  const missed = order.filter((t) => results[t.id] === "miss");
  const elapsed = status === "idle" ? 0 : now - t0;

  return (
    <div className="bg-card sticky top-16 z-10 grid gap-3 rounded-xl border p-4 shadow-sm">
      {status !== "playing" && filters.length > 0 && (
        <div className="flex flex-wrap gap-2 text-sm" role="group" aria-label="Choose a region">
          {[{ key: "all", label: "All" }, ...filters].map((f) => (
            <button key={f.key} type="button" onClick={() => setGroup(f.key)} className={cn("rounded-full border px-3 py-1", group === f.key && "bg-brand text-brand-foreground border-brand")}>{f.label}</button>
          ))}
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div aria-live="polite" className="min-w-0">
          {status === "idle" && <p className="font-semibold">{pool.length} {plural}. Press start, then click each one on the map.</p>}
          {status === "playing" && current && <p className="text-lg">Click <strong className="font-display text-xl">{current.name}</strong></p>}
          {status === "done" && <p className="text-lg font-semibold">{okCount} of {order.length} on the first try · {fmt(elapsed)}</p>}
          {msg && <p className="text-muted-foreground text-sm">{msg}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {status === "playing" && <span className="num text-muted-foreground">{done}/{order.length} · {fmt(elapsed)}</span>}
          {status === "playing" && <button type="button" onClick={() => current && advance("miss", current)} className="rounded-md border px-3 py-1.5">Skip</button>}
          <label className="flex items-center gap-1.5"><input type="checkbox" checked={study} onChange={(e) => setStudy(e.target.checked)} /> Show names</label>
          <label className="flex items-center gap-1.5"><input type="checkbox" checked={zoom} onChange={(e) => setZoom(e.target.checked)} /> Zoom</label>
          <button type="button" onClick={start} className="bg-brand text-brand-foreground rounded-md px-4 py-1.5 font-semibold">{status === "idle" ? "Start" : "Restart"}</button>
        </div>
      </div>
      {status === "done" && missed.length > 0 && (
        <p className="text-sm"><strong>Practice these:</strong> {missed.map((m) => m.name).join(", ")}</p>
      )}
    </div>
  );
}
