import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import ResumeUpload from "../components/ResumeUpload.jsx";
import JDInput from "../components/JDInput.jsx";
import { uploadResume } from "../services/api.js";

const FEATURES = [
  {
    title: "Skill Gap Report",
    description: "See exactly which skills and ATS keywords you're missing.",
    icon: (
      <path
        d="M9 12.5l2 2 4-4.5M12 3l7 3.5v5c0 4.5-3 8.5-7 9.5-4-1-7-5-7-9.5v-5L12 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
  {
    title: "Bullet Rewrites",
    description: "Get side-by-side rewrites of your weakest bullet points.",
    icon: (
      <path
        d="M4 17.25V20h2.75L17.81 8.94l-2.75-2.75L4 17.25ZM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83Z"
        fill="currentColor"
      />
    ),
  },
  {
    title: "Cover Letter",
    description: "Generate a tailored cover letter matched to your fit.",
    icon: (
      <path
        d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z M4 7l8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
];

export default function HomePage() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!resumeFile || !jobDescription.trim()) {
      setError("Please upload a resume and paste a job description.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      const { session_id } = await uploadResume(resumeFile, jobDescription);
      navigate(`/results/${session_id}`);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-brand-50/60 via-white to-white">
      <Header />

      <main className="mx-auto max-w-3xl px-6 pb-20 pt-14">
        <div className="animate-fade-in text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
              <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2Z" />
            </svg>
            Agentic AI resume tailoring
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Land more interviews with a <span className="text-brand-600">tailored</span> resume
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-600">
            Upload your resume and a job description. TailorAI analyzes the fit, rewrites your
            weakest bullets, and drafts a matching cover letter — in seconds.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <svg viewBox="0 0 24 24" className="h-5 w-5">
                  {feature.icon}
                </svg>
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-800">{feature.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">{feature.description}</p>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="animate-fade-in mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8"
        >
          <ResumeUpload file={resumeFile} onFileSelect={setResumeFile} />
          <div className="mt-6">
            <JDInput value={jobDescription} onChange={setJobDescription} />
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none">
                <path
                  d="M12 9v4m0 4h.01M10.29 3.86l-8.18 14.18A1 1 0 0 0 3 19.5h18a1 1 0 0 0 .87-1.46L13.71 3.86a1 1 0 0 0-1.72 0Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-brand-600/25 transition-all hover:bg-brand-700 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          >
            {isSubmitting ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z"
                  />
                </svg>
                Analyzing...
              </>
            ) : (
              "Analyze my fit"
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
