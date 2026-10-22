import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import DrivewayPhotos from "@/components/DrivewayPhotos";
import Button from "@/components/Button";


export default function GalleryPage() {
  return <Container><div className="py-12 md:py-16">
    <SectionHeading as="h1" eyebrow="OUR WORK" title="Real work. See the difference." subtitle="Before and after a concrete driveway clean. Take a look at our original job photos." />
    <article className="mt-8" aria-labelledby="driveway-project">
      <h2 id="driveway-project" className="mb-5 text-xl font-semibold">Concrete driveway pressure cleaning</h2>
      <DrivewayPhotos showLink={false} />
      <p className="mt-4 max-w-3xl leading-relaxed text-white/80">Cleaning lifted built-up surface grime from the driveway. Existing cracks and the darker strip at the front remain visible. Cleaning does not repair concrete or guarantee removal of permanent stains.</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row"><Button href="/contact#quote">Get a Free Quote</Button><Button href="tel:0411076785" variant="outline">Call 0411 076 785</Button></div>
    </article>
  </div></Container>;
}
