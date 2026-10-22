# Optional quote photos — owner review

Based on merged landing-page PR #10 (`ab7e252939897087859a0f358fdcf1ffe64a07f3`). This slice adds optional photos to the shared quote form on `/contact` and `/driveway-cleaning-gold-coast`. Stop for owner review before merge or production release.

## Customer experience

- Add up to three JPG, PNG or WebP photos, with previews and individual removal. Original files up to 10 MiB each are accepted in the browser; HEIC and documents are not supported. A clear message suggests a JPG or screenshot when needed.
- Prepare copies on the device at up to 1,600 pixels on the longest edge and 600 KiB per file. The whole photo is retained without cropping or visual enhancement. The customer's original stays on their device.
- Photo preparation and sending have explicit loading states. Submitting without photos still works. Failed preparation keeps existing selected photos; a failed enquiry keeps fields and all prepared photos for retry.
- The existing success contract, 25-second request timeout and synchronous duplicate-submit guard remain. A retry retains its UUID and prepared files; changing selected photos makes a new request identity.

## Validation, delivery and privacy

- Use the existing `/api/quote` and Resend notification. Send sanitized JPEG attachments directly with the enquiry; no storage bucket, public attachment URL, database, environment change or new paid service.
- The API accepts bounded multipart requests (2 MiB streamed limit) as well as existing JSON enquiries (16 KiB). It checks photo count, byte size, magic bytes, declared MIME, actual decoder format, dimensions and animation. Unsupported, malformed and truncated files fail before sending.
- Sharp decodes and re-encodes each attachment with a 2.56 megapixel input cap and a processing timeout. EXIF/GPS and original filenames are removed. Attachments have fixed `job-photo-1.jpg` names. Only normalized JPEG bytes are sent to the configured business inbox.
- Sharp 0.34.5 was already installed through Next.js; it is now an explicit runtime dependency so attachment validation does not depend on an optional transitive package.
- No uploads are written to the repository, public directory or an application storage service. In-flight file bytes are processed in memory. The existing bounded retry cache stores request digests and acceptance responses, not photos. The email provider and business mailbox retain email/attachments under their existing account policies; this implementation does not promise automatic deletion from those services.
- A note beside Submit explains that details/photos go to No Pressure via Resend, are not published, and should avoid people or sensitive documents. Selecting photos is optional.
- Photo digests participate in server idempotency; retries of the same enquiry/photos deduplicate, while different photo contents form a separate request. Existing origin, honeypot, rate limiting, recipient/sender checks and honest acceptance/error messages are retained.

## Verification

- `npm run build` and `npm run typecheck` passed.
- All 44 unit/integration tests passed, covering actual JPEG/PNG/WebP decoding, EXIF stripping/orientation, invalid and disguised files, size/count/dimension caps, multipart bounds with false/missing content lengths, duplicate submissions, retries, and attachment serialization/rejection through the installed Resend SDK. These use a mocked provider, not a live inbox.
- Production HTTP smoke checks passed for existing pages, both upload controls, valid multipart routing without credentials, rejected fake images and existing API error paths.
- Production-browser tests passed at widths 320, 390, 768 and 1440. JPG/PNG/WebP preparation, malformed/large/excess photo errors, thumbnail loading/removal, no horizontal overflow, native email validation, disabled sending, actual API 503, simulated provider 502, retained photos/details/retry UUID, repeat-tap protection, success/reset, landing-page upload, no-photo enquiries and UTM/anchor retention were checked. No browser JavaScript errors were observed.
- ESLint returned zero errors and six pre-existing image warnings in unchanged files. Existing Browserslist/Node module-type advisories remain.
- Review screenshots: [mobile](review/quote-photos-mobile.png), [desktop](review/quote-photos-desktop.png).

## Human checkpoint

Open the preview on your phone, submit a clearly labelled test enquiry with one or two photos, and confirm the email attachments arrive and open. The owner's earlier test verified text-only delivery; attachment inbox receipt is a separate check and is not claimed by the mocked tests.

No homepage/gallery images or branding were modified. No analytics, conversion tracking, live Ads settings, main merge or production deployment are part of this slice. Ads should remain unpublished/paused until destination and conversion tracking are finished and approved.

References: [Resend attachments](https://resend.com/docs/dashboard/emails/attachments), [Vercel request limits](https://vercel.com/docs/functions/limitations#request-body-size), [Sharp input limits](https://sharp.pixelplumbing.com/api-constructor/), [Sharp metadata handling](https://sharp.pixelplumbing.com/api-output/#keepmetadata).
