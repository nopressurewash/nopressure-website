import { createHash } from "node:crypto";
import sharp from "sharp";
import { MAX_QUOTE_PHOTOS, MAX_QUOTE_PHOTO_BYTES, MAX_QUOTE_PHOTO_EDGE } from "./quote-photo-limits.ts";

export type QuoteAttachment = { filename: string; content: Buffer; contentType: "image/jpeg" };
type PhotoInput = { bytes: Buffer; format: "jpeg" | "png" | "webp"; digest: string };

export class QuotePhotoError extends Error {}

function imageFormat(bytes: Buffer): PhotoInput["format"] | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpeg";
  if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return "png";
  if (bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP") return "webp";
  return null;
}

export async function readQuotePhotos(files: File[]): Promise<PhotoInput[]> {
  if (files.length > MAX_QUOTE_PHOTOS) throw new QuotePhotoError("Please attach no more than 3 photos.");
  const photos: PhotoInput[] = [];
  for (const file of files) {
    if (!file.size || file.size > MAX_QUOTE_PHOTO_BYTES) throw new QuotePhotoError("A photo is too large. Remove it and add it again so the form can resize it.");
    const bytes = Buffer.from(await file.arrayBuffer());
    const format = imageFormat(bytes);
    const expectedType = format ? `image/${format === "jpeg" ? "jpeg" : format}` : null;
    if (!format || file.type !== expectedType) throw new QuotePhotoError("Please use valid JPG, PNG or WebP photos. Other files cannot be attached.");
    photos.push({ bytes, format, digest: createHash("sha256").update(bytes).digest("hex") });
  }
  return photos;
}

// Decode and re-encode every upload. Never trust a filename, MIME declaration or header alone.
// Only the resulting JPEG bytes go to Resend; original names and EXIF/GPS data are discarded.
export async function quoteAttachments(photos: PhotoInput[]): Promise<QuoteAttachment[]> {
  const attachments: QuoteAttachment[] = [];
  for (const [index, photo] of photos.entries()) {
    try {
      const image = sharp(photo.bytes, { limitInputPixels: MAX_QUOTE_PHOTO_EDGE ** 2, failOn: "warning" });
      const metadata = await image.metadata();
      if (metadata.format !== photo.format || !metadata.width || !metadata.height || metadata.width > MAX_QUOTE_PHOTO_EDGE || metadata.height > MAX_QUOTE_PHOTO_EDGE || (metadata.pages || 1) !== 1) throw new Error("Invalid dimensions or animation");
      let content = await image.rotate().flatten({ background: "#fff" }).jpeg({ quality: 82 }).timeout({ seconds: 3 }).toBuffer();
      if (content.byteLength > MAX_QUOTE_PHOTO_BYTES) content = await image.clone().resize({ width: 1024, height: 1024, fit: "inside", withoutEnlargement: true }).jpeg({ quality: 70 }).timeout({ seconds: 3 }).toBuffer();
      if (content.byteLength > MAX_QUOTE_PHOTO_BYTES) throw new Error("Encoded photo too large");
      attachments.push({ filename: `job-photo-${index + 1}.jpg`, content, contentType: "image/jpeg" });
    } catch {
      throw new QuotePhotoError("A photo could not be checked. Remove it and try another photo, or send your enquiry without photos.");
    }
  }
  return attachments;
}
