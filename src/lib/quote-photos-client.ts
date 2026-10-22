import { MAX_PHOTO_SOURCE_BYTES, MAX_QUOTE_PHOTO_BYTES, QUOTE_PHOTO_TYPES } from "./quote-photo-limits.ts";

function jpegBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => canvas.toBlob((blob) => {
    if (blob) resolve(blob);
    else reject(new Error("This photo could not be prepared. Try another JPG, PNG or WebP photo."));
  }, "image/jpeg", quality));
}

// Resize the whole photo without cropping or enhancement. The original stays on the device.
export async function prepareQuotePhoto(source: File): Promise<File> {
  const supported = (QUOTE_PHOTO_TYPES as readonly string[]).includes(source.type) || (!source.type && /\.(jpe?g|png|webp)$/i.test(source.name));
  if (!supported) throw new Error("Please choose JPG, PNG or WebP photos. For HEIC, export a JPG or use a screenshot.");
  if (!source.size || source.size > MAX_PHOTO_SOURCE_BYTES) throw new Error("Each original photo must be under 10 MB. Try a smaller copy or screenshot.");
  const url = URL.createObjectURL(source);
  const image = new Image();
  image.src = url;
  const canvas = document.createElement("canvas");
  try {
    await image.decode();
    if (!image.naturalWidth || !image.naturalHeight || image.naturalWidth * image.naturalHeight > 50_000_000) throw new Error("Photo dimensions are too large. Try a smaller copy or screenshot.");
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Photos could not be prepared in this browser. You can remove them and send your enquiry without photos.");
    for (const [edge, quality] of [[1600, 0.84], [1600, 0.7], [1280, 0.7], [1024, 0.65]]) {
      const scale = Math.min(1, edge / Math.max(image.naturalWidth, image.naturalHeight));
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      context.fillStyle = "#fff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const blob = await jpegBlob(canvas, quality);
      if (blob.size <= MAX_QUOTE_PHOTO_BYTES) return new File([blob], "job-photo.jpg", { type: "image/jpeg", lastModified: 0 });
    }
    throw new Error("This photo is still too large. Try a smaller copy or send your enquiry without it.");
  } catch (error) {
    if (error instanceof DOMException) throw new Error("This photo could not be opened. Try another JPG, PNG or WebP photo.");
    throw error;
  } finally {
    URL.revokeObjectURL(url);
    image.src = "";
    canvas.width = 0;
    canvas.height = 0;
  }
}
