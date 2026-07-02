import { useState } from "react";

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
        copied
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
      }`}
    >
      {copied ? (
        <>
          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none">
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none">
            <rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
            <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" stroke="currentColor" strokeWidth="1.8" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

export default function BulletRewrite({ bullets }) {
  if (!bullets || bullets.length === 0) return null;

  return (
    <section className="animate-fade-in mb-8">
      <h2 className="mb-4 text-lg font-bold text-slate-900">Resume Bullet Rewrites</h2>
      <div className="flex flex-col gap-4">
        {bullets.map((bullet, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
              <div className="p-5">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Original
                </div>
                <p className="text-sm leading-relaxed text-slate-500">{bullet.original}</p>
              </div>
              <div className="bg-brand-50/30 p-5">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-brand-600">
                    Rewritten
                  </span>
                  <CopyButton text={bullet.rewritten} />
                </div>
                <p className="text-sm leading-relaxed text-slate-800">{bullet.rewritten}</p>
              </div>
            </div>
            {bullet.reason && (
              <div className="flex items-start gap-1.5 border-t border-slate-100 bg-slate-50 px-5 py-2.5">
                <svg viewBox="0 0 24 24" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" fill="none">
                  <path
                    d="M12 18h.01M9.5 9a2.5 2.5 0 1 1 3.79 2.147c-.658.393-1.29.951-1.29 1.853V13.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-xs italic leading-relaxed text-slate-500">{bullet.reason}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
