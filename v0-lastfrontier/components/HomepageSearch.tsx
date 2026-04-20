"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { HomepageSearchEntry } from "@/lib/homepageSearch";
import { searchHomepageEntries } from "@/lib/homepageSearch";

export default function HomepageSearch({
  entries,
}: {
  entries: HomepageSearchEntry[];
}) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => searchHomepageEntries(entries, query), [entries, query]);

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-panel">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Search by port or activity</p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Type a port, activity, or Alaska landmark</h2>
        <p className="max-w-3xl text-sm leading-6 text-slate-600">
          Try searches like Juneau, whale watching, Mendenhall, White Pass, Creek Street, Misty Fjords, or kayaking.
        </p>
      </div>

      <div className="mt-5 space-y-4">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search ports, activities, landmarks, or sub-intents"
          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 outline-none transition focus:border-slate-900"
        />

        {query.trim() ? (
          results.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {results.map((result) => (
                <Link
                  key={`${result.typeLabel}-${result.href}`}
                  href={result.href}
                  className="rounded-[24px] border border-slate-200 bg-fog p-4 transition hover:-translate-y-0.5 hover:border-slate-300"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{result.typeLabel}</p>
                  <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-950">{result.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{result.description}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-fog p-4 text-sm leading-6 text-slate-600">
              No direct match yet. Try a port like Juneau or Seward, an activity like whale watching or scenic rail, or a landmark like Mendenhall or White Pass.
            </div>
          )
        ) : (
          <div className="flex flex-wrap gap-2">
            {["Juneau", "whale watching", "Mendenhall", "White Pass", "Misty Fjords", "kayaking"].map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setQuery(example)}
                className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-950"
              >
                {example}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
