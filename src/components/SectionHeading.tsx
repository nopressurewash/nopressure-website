export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div>
      <div className="text-sm text-white/60 tracking-widest">{eyebrow}</div>
      <h2 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">{title}</h2>
      {subtitle ? (
        <p className="mt-3 text-white/75 leading-relaxed max-w-2xl">{subtitle}</p>
      ) : null}
    </div>
  );
}
