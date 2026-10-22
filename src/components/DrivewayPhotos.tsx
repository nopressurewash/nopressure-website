import Button from "./Button";

export default function DrivewayPhotos({ showLink = true }: { showLink?: boolean }) {
  return <div>
    <div className="grid grid-cols-2 gap-3 sm:gap-6">
      {(["before", "after"] as const).map((stage) => <figure key={stage} className="min-w-0 overflow-hidden rounded-2xl border border-white/15 bg-np-black">
        <figcaption className="border-b border-white/10 px-3 py-3 text-sm font-semibold text-np-gold sm:px-5">{stage === "before" ? "Before cleaning" : "After cleaning"}</figcaption>
        <a href={`/images/driveway-${stage}.jpg`} target="_blank" rel="noopener noreferrer" aria-label={`Open original ${stage} cleaning photograph in a new tab`}>
          <picture>
            <source type="image/webp" srcSet={[480, 800, 1230].map((width) => `/images/driveway-${stage}-${width}.webp ${width}w`).join(", ")} sizes="(max-width: 640px) 46vw, (max-width: 1152px) 45vw, 540px" />
            <img src={`/images/driveway-${stage}.jpg`} alt={stage === "before" ? "Concrete driveway before pressure cleaning, with surface grime, cracks, cleaning equipment and hoses visible." : "The same concrete driveway after cleaning, photographed from further back; cracks, shadows and the darker front strip remain visible."} width={stage === "before" ? 1228 : 1229} height={1536} loading="lazy" decoding="async" className="block h-auto w-full" />
          </picture>
        </a>
      </figure>)}
    </div>
    <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/70">Our original job photographs, taken from different positions. Tap either photo for a closer look.</p>
    {showLink && <Button href="/gallery" variant="flat" className="mt-3">View the job photos</Button>}
  </div>;
}
