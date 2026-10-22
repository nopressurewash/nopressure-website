import { PRICE_NOTE } from "@/lib/business";

export default function DrivewayOffer() {
  return <div className="my-5 max-w-xl rounded-2xl border border-np-gold/40 bg-black/65 px-5 py-4">
    <p className="text-lg font-semibold text-white sm:text-xl">Driveway cleaning packages <span className="whitespace-nowrap text-np-gold">from $169</span></p>
    <p className="mt-2 text-xs leading-relaxed text-white/80">{PRICE_NOTE}</p>
  </div>;
}
