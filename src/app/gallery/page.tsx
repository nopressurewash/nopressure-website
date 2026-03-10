import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";

const COMPARISONS = [
  {
    beforeSrc: "",
    afterSrc: "",
    beforeAlt: "Driveway before cleaning",
    afterAlt: "Driveway after cleaning",
    label: "Driveway Pressure Clean",
  },
  {
    beforeSrc: "",
    afterSrc: "",
    beforeAlt: "Footpath before cleaning",
    afterAlt: "Footpath after cleaning",
    label: "Footpath Restoration",
  },
];

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
          title="Before & After Results"
          subtitle="See the difference professional pressure cleaning makes. Drag the slider to compare."
        />

        {/* Before / After comparison sliders */}
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {COMPARISONS.map((comp) => (
            <div key={comp.label}>
              <BeforeAfterSlider
                beforeSrc={comp.beforeSrc || undefined}
                afterSrc={comp.afterSrc || undefined}
                beforeAlt={comp.beforeAlt}
                afterAlt={comp.afterAlt}
              />
              <p className="mt-3 text-center text-sm font-medium text-white/50 tracking-wide">
                {comp.label}
              </p>
            </div>
          ))}
        </div>

        {/* Gallery grid */}
        <div className="mt-16">
          <h3 className="text-lg md:text-xl font-bold text-white tracking-wide mb-6">
            Project Gallery
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <Placeholder key={i} label={`Photo ${i + 1}`} />
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-[var(--np-black)] p-6 text-sm text-white/70">
          Tip: For best results, use consistent lighting and similar angles for before/after shots.
        </div>
      </div>
    </Container>
  );
}
