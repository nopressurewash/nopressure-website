import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";

const Placeholder = ({ label }: { label: string }) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 aspect-[4/3] flex items-center justify-center text-xs text-white/55">
    {label}
  </div>
);

export default function GalleryPage() {
  return (
    <Container>
      <div className="py-14 md:py-18">
        <SectionHeading
          eyebrow="GALLERY"
          title="Before & after results"
          subtitle="Drop your photos into this page when you’re ready. Keep them high resolution for the premium feel."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <Placeholder key={i} label={`Photo ${i + 1}`} />
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-[var(--np-black)] p-6 text-sm text-white/70">
          Tip: For best results, use consistent lighting and similar angles for before/after shots.
        </div>
      </div>
    </Container>
  );
}
