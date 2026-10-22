const PRICE_NOTE = "Final quote depends on size, condition, access and treatment.";

export default function DrivewayOffer() {
  return (
    <div className="my-6 max-w-sm sm:my-7">
      <p className="flex items-baseline justify-center gap-2 text-sm text-white/80 sm:text-base">
        Packages from <span className="text-3xl font-semibold tracking-tight text-np-gold">$169</span>
      </p>
      <p className="mx-auto mt-2 max-w-[20rem] text-xs leading-relaxed text-white/70">{PRICE_NOTE}</p>
    </div>
  );
}
