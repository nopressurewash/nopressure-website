const PRICE_NOTE = "Final quote depends on size, condition, access and treatment.";

export default function DrivewayOffer({ align = "center" }: { align?: "center" | "left" }) {
  return (
    <div className="my-6 max-w-sm sm:my-7">
      <p className={`flex items-baseline gap-2 text-sm text-white/80 sm:text-base ${align === "left" ? "justify-start" : "justify-center"}`}>
        Packages from <span className="text-3xl font-semibold tracking-tight text-np-gold">$169</span>
      </p>
      <p className={`mt-2 max-w-[20rem] text-xs leading-relaxed text-white/70 ${align === "left" ? "" : "mx-auto"}`}>{PRICE_NOTE}</p>
    </div>
  );
}
