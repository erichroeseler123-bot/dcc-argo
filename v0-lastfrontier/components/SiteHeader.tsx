import Link from "next/link";
import { CITIES } from "@/data/alaska";

export default function SiteHeader() {
  return (
    <header className="border-b border-white/10 bg-ink text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm font-semibold">
            LF
          </div>
          <div>
            <div className="text-sm uppercase tracking-[0.22em] text-glacier/70">Last Frontier</div>
            <div className="text-lg font-semibold">Shore Excursions</div>
          </div>
        </Link>
        <nav className="hidden flex-wrap items-center gap-5 text-sm text-glacier/80 md:flex">
          {CITIES.slice(0, 6).map((city) => (
            <Link key={city.slug} href={`/${city.slug}`} className="transition hover:text-white">
              {city.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
