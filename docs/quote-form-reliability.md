# Stage 2 — quote form reliability

**Owner review required before merge or production release.** Based on merged PR #8 (`247b1363767f46746a1ce387377c14ef4d5f6f95`). The owner confirmed a live quote enquiry reached their inbox on 22 October 2026. That is evidence for the previous delivery path; it is not a new delivery test of this branch.

## Changes

- Preserve all six customer fields, the existing four service choices, recipient environment variable, reply-to address and clickable email/phone details in the notification.
- Trim and validate contact details server-side; enforce field lengths, service choices, single-line contact fields and a 16 KiB streamed body cap. Reject malformed or unsupported requests with explicit error responses.
- Check both Resend's error object and a nonempty acceptance ID. Only return 202 / `success: true` / `status: accepted` after acceptance. This is not a claim of inbox delivery.
- Client requires that exact success contract, prevents overlapping submissions synchronously, disables fields while submitting and keeps entered details after an error. Requests time out after 25 seconds with a retry/call option.
- Retain the same UUID and payload after a timeout or failure. Resend receives an idempotency key so the same enquiry retry is not sent again across server instances within the provider's 24-hour window. Different edited requests use a different identity.
- Collapse simultaneous/rapid identical submissions on a single server instance. Five attempts per visitor per 15 minutes are allowed, with 429 / Retry-After afterwards. Honeypot protection and origin checks are included. Memory is bounded and entries expire.
- Existing already-open forms without a UUID continue working; their provider key uses the job digest and a five-minute window. They do not have the full new client's retry guarantees across window boundaries.
- Logs contain fixed outcome codes only. No name, email, phone, message, raw IP, API key or raw provider exception is logged. No uploads, analytics, database or new dependency is added.
- Visible success/error feedback is announced and focused. Inputs have autocomplete, lengths and readable mobile font sizing. The approved homepage, gallery, branding and original photos are untouched.

## Sender configuration and explicit remaining task

The current code sends from `No Pressure Website <onboarding@resend.dev>`. The owner's successful test confirms that the existing recipient works with that setup. This branch preserves it as the fallback so merging the code does not silently interrupt the known delivery path.

`QUOTE_FROM_EMAIL` now optionally selects a sender on `nopressure.au` or a subdomain. Syntax validation is not domain verification; Resend remains the authority. An invalid or rejected configured sender fails explicitly, with no silent fallback. No production environment variable, API key, DNS record or sender account has been changed.

To complete the business-domain switch:

1. In [Resend Domains](https://resend.com/domains), check whether `nopressure.au` is verified for sending. If it is not, follow Resend's supplied domain-verification records. Preserve existing inbound email records.
2. After verification, set **Preview only** `QUOTE_FROM_EMAIL` to `No Pressure Website <hi@nopressure.au>` in the Vercel project `nopressure-website`. The existing `RESEND_API_KEY` and `QUOTE_TO_EMAIL` stay private and retain their configured values.
3. Redeploy the preview and send a labelled test quote. Confirm it reaches the intended inbox and replies address the test customer.
4. Obtain explicit owner approval before applying the sender setting to Production or making any production deployment. Approval to review a preview is not release approval.

No Resend plugin was available in the current connection, and Vercel protected-deployment/environment access was previously denied. Domain verification and configuration therefore remain unverified. Do not mark this task complete from the screenshot of the earlier test alone.

References: [Resend domain verification](https://resend.com/docs/dashboard/domains/introduction) and [Resend idempotency keys](https://resend.com/docs/dashboard/emails/idempotency-keys).

## Validation and review

Run with Node 24:

```sh
npm test
npm run lint
npm run build
npm run test:http
```

30 focused tests cover provider rejection/exception/missing ID, the installed Resend SDK's HTTP error and idempotency behaviour, cross-instance retry keys, concurrent duplicates, invalid fields, escaping, recipient/sender configuration, honeypot, body bounds, origin rejection and internal-host proxy regression, rate windows, legacy forms and the client's refusal of malformed or misleading success responses. They mock the provider and send no real email. The HTTP smoke check runs the actual production build with mail credentials deliberately blank, checks homepage/gallery/contact rendering and verifies 405/400/503/413/403/415/429 API paths. It is not a real provider-delivery test.

### Verification result

Story: a visitor submits the contact form, the API validates the enquiry and asks Resend to send it, and the form shows success only after an explicit acceptance response.

| Boundary | Evidence | Result |
| --- | --- | --- |
| Page rendering and API routing | Production-server HTTP smoke check passed | Verified locally |
| API validation, provider responses and retry behaviour | 26 handler tests passed, including mocked HTTP through the installed Resend SDK | Verified with test data |
| Acceptance response contract | Four client response tests passed | Verified with test data |
| Compilation and lint | `next build` passed; ESLint returned zero errors and six pre-existing image warnings in unchanged files | Passed |
| Server-only configuration | No mail environment-variable references found in compiled client JavaScript | Passed |
| Deployed browser interaction and real inbox receipt for this branch | Protected preview and provider credentials are unavailable to this session | Owner preview test still required |

No browser interaction or real email-delivery test of the new branch is claimed. The earlier successful live enquiry remains evidence for the existing production configuration only.

Rate limiting and same-content duplicate detection are **instance-local best effort**, not a global rate guarantee. Persistent storage or a Vercel firewall policy would be a separately approved improvement if abuse warrants it. Browser request UUID + provider idempotency is the cross-instance retry protection.

For human preview review: check the mobile form, use invalid contact details, submit one labelled test quote, confirm it arrives, and inspect the honest success message. Automated happy-path tests do not replace this deployed check. Stop at this review checkpoint; conversion tracking and other phases are not included.
