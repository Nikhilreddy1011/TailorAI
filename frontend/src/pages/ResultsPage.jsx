import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSession } from "../services/api.js";
import Header from "../components/Header.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import GapReport from "../components/GapReport.jsx";
import BulletRewrite from "../components/BulletRewrite.jsx";
import CoverLetter from "../components/CoverLetter.jsx";

const POLL_INTERVAL_MS = 2000;

function NewAnalysisLink() {
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
        <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      New Analysis
    </Link>
  );
}

export default function ResultsPage() {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const data = await getSession(sessionId);
        if (cancelled) return;
        setSession(data);
        if (data.status !== "processing" && intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      } catch (err) {
        if (cancelled) return;
        setError(err.response?.data?.detail || "Failed to load session.");
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }

    poll();
    intervalRef.current = setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header action={<NewAnalysisLink />} />

      <main className="mx-auto max-w-3xl px-6 pb-20 pt-10">
        <h1 className="mb-6 text-2xl font-extrabold tracking-tight text-slate-900">Results</h1>

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!error && !session && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <svg className="h-4 w-4 animate-spin text-brand-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z" />
            </svg>
            Loading...
          </div>
        )}

        {session && (
          <>
            <div className="mb-8">
              <ProgressBar
                currentStep={session.current_step}
                currentStepName={session.current_step_name}
                status={session.status}
              />
            </div>

            {session.status === "failed" && (
              <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-5">
                <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 text-red-500" fill="none">
                  <path
                    d="M12 9v4m0 4h.01M10.29 3.86l-8.18 14.18A1 1 0 0 0 3 19.5h18a1 1 0 0 0 .87-1.46L13.71 3.86a1 1 0 0 0-1.72 0Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-red-800">Processing failed</p>
                  <p className="mt-0.5 text-sm text-red-600">
                    {session.error_message || "Something went wrong while analyzing your resume."}
                  </p>
                </div>
              </div>
            )}

            {session.status === "completed" && (
              <>
                <GapReport gapReport={session.gap_report} />
                <BulletRewrite bullets={session.rewritten_bullets} />
                <CoverLetter coverLetter={session.cover_letter} />

                {session.self_evaluation && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none">
                      <path
                        d="M9 12.5l2 2 4-4.5M12 3l7 3.5v5c0 4.5-3 8.5-7 9.5-4-1-7-5-7-9.5v-5L12 3Z"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Self-reviewed for accuracy
                    {session.self_evaluation.re_runs > 0 &&
                      ` · ${session.self_evaluation.re_runs} step${session.self_evaluation.re_runs > 1 ? "s" : ""} regenerated`}
                  </p>
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
