export default function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-slate-950">{title}</h2>
      <p className="max-w-3xl text-base leading-7 text-slate-600">{description}</p>
    </div>
  );
}
