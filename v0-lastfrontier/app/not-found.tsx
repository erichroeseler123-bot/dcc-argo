import Link from "next/link";

export default function NotFound() {
  return (
    <main className="space-y-6 rounded-[28px] bg-white p-10 shadow-panel">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Not found</p>
      <h1 className="text-4xl font-semibold tracking-tight text-slate-950">That Alaska page is not in the route map.</h1>
      <p className="max-w-2xl text-base leading-7 text-slate-600">
        Try a major port page or go back to the homepage to restart from port or activity type.
      </p>
      <div className="flex gap-3">
        <Link href="/" className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">
          Back to homepage
        </Link>
        <Link href="/juneau" className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900">
          Browse Juneau
        </Link>
      </div>
    </main>
  );
}
