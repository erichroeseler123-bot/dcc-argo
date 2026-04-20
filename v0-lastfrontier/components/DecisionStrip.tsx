export default function DecisionStrip({
  title,
  points,
}: {
  title: string;
  points: string[];
}) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-panel">
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {points.map((point) => (
          <div key={point} className="rounded-2xl bg-fog p-4 text-sm leading-6 text-slate-700">
            {point}
          </div>
        ))}
      </div>
    </section>
  );
}
