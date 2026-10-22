export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  as: Heading = "h2",
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div>
      <div className="text-sm text-white/60 tracking-widest">{eyebrow}</div>
      <Heading className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">{title}</Heading>
      {subtitle ? (
        <p className="mt-3 text-white/75 leading-relaxed max-w-2xl">{subtitle}</p>
      ) : null}
    </div>
  );
}
