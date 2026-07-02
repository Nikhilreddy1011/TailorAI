const STRATEGY_STYLES = {
  light_tweaks: { label: "Light Keyword Tweaks", bg: "bg-emerald-50", fg: "text-emerald-700", ring: "ring-emerald-200" },
  targeted_rewrite: { label: "Targeted Rewrite", bg: "bg-amber-50", fg: "text-amber-700", ring: "ring-amber-200" },
  aggressive_rewrite: { label: "Full Rewrite · Stretch Role", bg: "bg-red-50", fg: "text-red-700", ring: "ring-red-200" },
  skip_mismatch: { label: "Domain Mismatch · Rewrite Skipped", bg: "bg-slate-100", fg: "text-slate-600", ring: "ring-slate-200" },
};

function trackColor(pct) {
  if (pct > 85) return "#10b981";
  if (pct >= 40) return "#f59e0b";
  return "#ef4444";
}

function MatchGauge({ pct }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(Math.max(pct, 0), 100) / 100) * circumference;
  const color = trackColor(pct);

  return (
    <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
      <svg viewBox="0 0 100 100" className="h-28 w-28 -rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#eef0f4" strokeWidth="9" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-extrabold text-slate-900">{pct}%</span>
        <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">match</span>
      </div>
    </div>
  );
}

function SkillChips({ skills, tone }) {
  const styles =
    tone === "positive"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : "bg-red-50 text-red-700 ring-red-200";

  if (skills.length === 0) {
    return <p className="text-sm text-slate-400">None</p>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {skills.map((skill) => (
        <span
          key={skill}
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${styles}`}
        >
          {tone === "positive" ? (
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          )}
          {skill}
        </span>
      ))}
    </div>
  );
}

export default function GapReport({ gapReport }) {
  if (!gapReport) return null;

  const strategy = STRATEGY_STYLES[gapReport.agent_strategy] || {
    label: gapReport.agent_strategy,
    bg: "bg-slate-100",
    fg: "text-slate-600",
    ring: "ring-slate-200",
  };

  return (
    <section className="animate-fade-in mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-lg font-bold text-slate-900">Skill Gap Report</h2>

      <div className="mt-5 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <MatchGauge pct={gapReport.match_percentage} />
        <div>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${strategy.bg} ${strategy.fg} ${strategy.ring}`}
          >
            {strategy.label}
          </span>
          {gapReport.agent_reasoning && (
            <p className="mt-2 max-w-xl text-sm text-slate-500">{gapReport.agent_reasoning}</p>
          )}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Matching Skills
          </h3>
          <SkillChips skills={gapReport.matching_skills} tone="positive" />
        </div>
        <div>
          <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Missing Skills
          </h3>
          <SkillChips skills={gapReport.missing_skills} tone="negative" />
        </div>
        <div>
          <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
            ATS Keywords Found
          </h3>
          <SkillChips skills={gapReport.ats_keywords_found} tone="positive" />
        </div>
        <div>
          <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
            ATS Keywords Missing
          </h3>
          <SkillChips skills={gapReport.ats_keywords_missing} tone="negative" />
        </div>
      </div>
    </section>
  );
}
