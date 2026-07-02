import { Link } from "react-router-dom";

export default function Header({ action }) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm shadow-brand-600/30">
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none">
              <path
                d="M7 12.5l3 3 7-7"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Tailor<span className="text-brand-600">AI</span>
          </span>
        </Link>
        {action}
      </div>
    </header>
  );
}
