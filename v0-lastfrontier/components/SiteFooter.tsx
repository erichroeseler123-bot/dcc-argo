import Link from "next/link";
import { CITIES } from "@/data/alaska";

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Last Frontier Shore Excursions</p>
          <p className="max-w-xl text-sm leading-6 text-slate-600">
            Decision-focused Alaska shore excursion planning for cruise passengers and independent travelers.
            We help you narrow the right port, activity, and tour fast, then send you to the live booking page for the same tour at the same price.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Major ports</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            {CITIES.slice(0, 6).map((city) => (
              <li key={city.slug}>
                <Link href={`/${city.slug}`} className="hover:text-slate-900">
                  {city.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Planning note</h2>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Tour data and pricing come from live partner responses when available. You book directly with the operator, and we stay available if you need support.
          </p>
        </div>
      </div>
    </footer>
  );
}
