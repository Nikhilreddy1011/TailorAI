const STEPS = [
  "Parse resume",
  "Analyze JD",
  "Detect gaps",
  "Rewrite bullets",
  "Cover letter",
];

export default function ProgressBar({ currentStep, currentStepName, status }) {
  const isFailed = status === "failed";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start">
        {STEPS.map((label, i) => {
          const stepNum = i + 1;
          const isDone = status === "completed" || currentStep > stepNum;
          const isActive = status === "processing" && currentStep === stepNum;
          const isLast = i === STEPS.length - 1;

          return (
            <div key={label} className={`flex items-start ${isLast ? "" : "flex-1"}`}>
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors duration-500 ${
                    isFailed && isActive
                      ? "bg-red-100 text-red-600 ring-2 ring-red-200"
                      : isDone
                        ? "bg-emerald-500 text-white"
                        : isActive
                          ? "bg-brand-600 text-white ring-4 ring-brand-100"
                          : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {isDone ? (
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    stepNum
                  )}
                </div>
                <span
                  className={`mt-2 hidden text-center text-[11px] font-medium leading-tight sm:block ${
                    isDone || isActive ? "text-slate-700" : "text-slate-400"
                  }`}
                  style={{ width: 72 }}
                >
                  {label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={`mt-4 h-0.5 flex-1 rounded transition-colors duration-500 ${
                    currentStep > stepNum || status === "completed" ? "bg-emerald-500" : "bg-slate-100"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
        {status === "processing" && (
          <svg className="h-3.5 w-3.5 animate-spin text-brand-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z" />
          </svg>
        )}
        <p
          className={`text-sm font-medium ${
            status === "completed"
              ? "text-emerald-600"
              : status === "failed"
                ? "text-red-600"
                : "text-slate-600"
          }`}
        >
          {status === "completed"
            ? "All done — your results are ready."
            : status === "failed"
              ? "Something went wrong."
              : currentStepName || "Starting..."}
        </p>
      </div>
    </div>
  );
}
