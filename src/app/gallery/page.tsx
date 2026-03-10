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

const PROJECTS = [
  { service: "Driveway Pressure Clean", suburb: "Palm Beach" },
  { service: "Footpath Restoration", suburb: "Burleigh Heads" },
  { service: "Concrete Surface Cleaning", suburb: "Varsity Lakes" },
  { service: "Exterior House Soft Wash", suburb: "Mermaid Beach" },
  { service: "Driveway Pressure Clean", suburb: "Robina" },
  { service: "Footpath Restoration", suburb: "Southport" },
  { service: "Concrete Surface Cleaning", suburb: "Currumbin" },
  { service: "Exterior House Soft Wash", suburb: "Broadbeach" },
  { service: "Driveway Pressure Clean", suburb: "Miami" },
];

export default function GalleryPage() {
  return (
    <Container>
      <div className="py-14 md:py-18">
        <SectionHeading
          eyebrow="GALLERY"
          title="Before & After Transformations"
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
            Recent Projects
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {PROJECTS.map((project, i) => (
              <div key={i}>
                <div className="rounded-2xl border border-white/10 bg-white/5 aspect-[4/3] flex items-center justify-center text-xs text-white/55">
                  Photo {i + 1}
                </div>
                <div className="mt-2 px-1">
                  <p className="text-xs font-medium text-white/60 tracking-wide">{project.service}</p>
                  <p className="text-[11px] text-white/35">{project.suburb}</p>
                </div>
              </div>
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
