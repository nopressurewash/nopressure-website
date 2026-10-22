// Browser preparation keeps the multipart request comfortably below the host limit.
export const MAX_QUOTE_PHOTOS = 3;
export const MAX_PHOTO_SOURCE_BYTES = 10 * 1024 * 1024;
export const MAX_QUOTE_PHOTO_BYTES = 600 * 1024;
export const MAX_QUOTE_PHOTO_EDGE = 1600;
export const MAX_QUOTE_UPLOAD_BYTES = 2 * 1024 * 1024;
export const QUOTE_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const QUOTE_PHOTO_ACCEPT = ".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp";
