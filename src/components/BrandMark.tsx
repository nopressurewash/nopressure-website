import Link from "next/link";

export default function BrandMark() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-full border border-white/15 flex items-center justify-center">
        <span className="font-black text-np-gold">NP</span>
      </div>
      <div className="leading-tight">
        <div className="font-extrabold tracking-tight">
          <span className="text-np-gold">NO</span>{" "}
          <span className="text-white">PRESSURE</span>
        </div>
        <div className="text-xs text-white/60 tracking-[0.25em]">
          EXTERIOR SPECIALISTS
        </div>
      </div>
    </Link>
  );
}
