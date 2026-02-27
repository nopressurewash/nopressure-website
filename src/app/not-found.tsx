import Link from "next/link";
import Container from "@/components/Container";

export default function NotFound() {
  return (
    <Container>
      <div className="py-20">
        <div className="text-sm text-white/60 tracking-widest">404</div>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight">Page not found</h1>
        <p className="mt-3 text-white/75">Head back to the homepage.</p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-np-gold px-6 py-3 font-semibold text-black hover:brightness-110 transition"
        >
          Go Home
        </Link>
      </div>
    </Container>
  );
}
