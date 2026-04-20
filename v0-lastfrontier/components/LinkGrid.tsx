import Link from "next/link";

export default function LinkGrid({
  title,
  links,
}: {
  title: string;
  links: Array<{ href: string; label: string; description: string }>;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-panel transition hover:-translate-y-0.5 hover:border-slate-300"
          >
            <h3 className="text-lg font-semibold text-slate-950">{link.label}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{link.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
