export default function JDInput({ value, onChange }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <label className="block text-sm font-semibold text-slate-700">Job Description</label>
        <span className="text-xs text-slate-400">{value.length.toLocaleString()} characters</span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the full job description here..."
        rows={10}
        className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 transition-colors focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-100"
      />
    </div>
  );
}
