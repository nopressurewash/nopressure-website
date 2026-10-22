"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MAX_QUOTE_PHOTOS, QUOTE_PHOTO_ACCEPT } from "@/lib/quote-photo-limits";
import { prepareQuotePhoto } from "@/lib/quote-photos-client";

function PhotoPreview({ file, index, remove, disabled }: { file: File; index: number; remove: () => void; disabled: boolean }) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    const preview = URL.createObjectURL(file);
    setUrl(preview);
    return () => URL.revokeObjectURL(preview);
  }, [file]);
  return (
    <li className="flex min-w-0 items-center gap-3 rounded-xl border border-white/15 p-3">
      {url && <Image src={url} alt={`Selected job photo ${index + 1}`} width={56} height={56} unoptimized className="h-14 w-14 shrink-0 rounded-lg object-cover" />}
      <span className="min-w-0 flex-1 text-sm text-white/80">Photo {index + 1}</span>
      <button type="button" onClick={remove} disabled={disabled} aria-label={`Remove photo ${index + 1}`} className="min-h-11 shrink-0 px-2 text-sm text-np-gold underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-np-gold disabled:opacity-50">Remove</button>
    </li>
  );
}

export default function QuotePhotos({ photos, onChange, onPreparing }: { photos: File[]; onChange: (photos: File[]) => void; onPreparing: (preparing: boolean) => void }) {
  const [preparing, setPreparing] = useState(false);
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  async function selectPhotos(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files || []);
    event.target.value = "";
    if (!selected.length || preparing) return;
    setError("");
    if (photos.length + selected.length > MAX_QUOTE_PHOTOS) {
      setError("You can attach up to 3 photos. Remove one before adding another.");
      requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }
    setPreparing(true);
    onPreparing(true);
    try {
      const prepared: File[] = [];
      // Work sequentially so several large phone photos do not decode at once.
      for (const file of selected) prepared.push(await prepareQuotePhoto(file));
      onChange([...photos, ...prepared]);
    } catch (error) {
      setError(error instanceof Error ? error.message : "The photos could not be prepared. Try another photo or continue without photos.");
      requestAnimationFrame(() => errorRef.current?.focus());
    } finally {
      setPreparing(false);
      onPreparing(false);
    }
  }

  return (
    <div className="grid min-w-0 gap-2 rounded-2xl border border-white/10 p-4" aria-busy={preparing}>
      <label htmlFor="qf-photos" className="text-sm font-medium text-white/80">Photos <span className="font-normal text-white/60">(optional)</span></label>
      <p id="qf-photos-help" className="text-sm leading-relaxed text-white/65">Show us the area and any problem spots. Up to 3 JPG, PNG or WebP photos, 10 MB each. We resize copies for email.</p>
      <input ref={input} id="qf-photos" name="photos" type="file" multiple accept={QUOTE_PHOTO_ACCEPT} onChange={selectPhotos} disabled={preparing || photos.length >= MAX_QUOTE_PHOTOS} aria-describedby={`qf-photos-help${error ? " qf-photos-error" : ""}`} aria-invalid={!!error} className="sr-only" />
      <button type="button" onClick={() => input.current?.click()} disabled={preparing || photos.length >= MAX_QUOTE_PHOTOS} className="min-h-11 w-full rounded-full border border-np-gold/60 px-4 py-2.5 text-sm font-semibold text-np-gold transition-colors hover:bg-np-gold/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-np-gold disabled:cursor-not-allowed disabled:opacity-50">
        {preparing ? "Preparing photos…" : photos.length === MAX_QUOTE_PHOTOS ? "3 photos selected" : photos.length ? "Add another photo" : "Add photos"}
      </button>
      {preparing && <p role="status" className="text-sm text-white/80">Preparing photos. Please wait before submitting.</p>}
      {photos.length > 0 && <ul aria-label="Selected photos" className="grid min-w-0 gap-2">{photos.map((file, index) => <PhotoPreview key={`${index}-${file.size}`} file={file} index={index} disabled={preparing} remove={() => { onChange(photos.filter((_, i) => i !== index)); setError(""); }} />)}</ul>}
      {!preparing && <p role="status" className="sr-only">{photos.length} of 3 photos selected.</p>}
      {error && <p ref={errorRef} id="qf-photos-error" role="alert" tabIndex={-1} className="text-sm text-red-200">{error} Your existing photos have been kept. You can still send without adding these photos.</p>}
    </div>
  );
}
