# Stage 3 — driveway landing page review

**Owner review required before merge or production release.** This slice starts from `main` at `629fae98194d4f77f83691b7a751dbaeb64a7e0b`, including the quote-form reliability work merged in PR #9.

## Page and scope

Route: `/driveway-cleaning-gold-coast`.

- Concise driveway pressure-cleaning headline, Gold Coast coverage and the shared $169 starting offer with pricing conditions.
- The existing transparent No Pressure wordmark and black, gold and purple styling.
- The same genuine side-by-side driveway photographs used on the homepage and gallery. Complete images retain their aspect ratios, responsive WebP variants and links to the original JPEGs. The caption identifies the different camera positions.
- Brief service details, realistic stain/damage limitations, local service information, a three-step quote process and native keyboard-operable FAQs.
- One instance of the existing six-field quote form, with driveway cleaning selected by default. Page CTAs and this route’s header quote buttons jump directly to `#quote`; telephone and email links remain available.
- Page-specific title, description, canonical URL and social metadata. Broader SEO work and structured data are outside this slice.

`DrivewayOffer` has an optional left alignment; its existing centred default is retained. The homepage and gallery source, original photographs, branding assets, quote form, email handler and sender configuration are unchanged. No project dependency, analytics integration, upload feature, campaign setting or production environment change is included.

Mobile QA exposed a pre-existing layout issue: the fixed body height let the sticky header scroll away on long pages. The body now has a minimum height so it grows with its content and keeps the existing header available. The landing-page logo link also avoids automatically prefetching the homepage’s decorative hero image.

## Verification

Story: an advertising visitor sees the service, area, starting price and genuine results, then jumps to the on-page quote form or chooses to call.

- `npm test`: 30 tests passed, covering the existing form/API acceptance contract, provider rejection, validation, duplicates and retries.
- `npm run build`: passed, including TypeScript and static generation of the new route.
- `npm run lint`: zero errors; six existing image warnings. The new page introduces no warning.
- `npm run test:http`: passed against the production build with mail credentials deliberately blank. Checks include existing routes, the new landing page with UTM parameters, a single H1, canonical URL, on-page quote anchors, all six form fields, responsive image responses and existing API failure/rate-limit paths.
- Original photograph SHA-256 values match the owner-supplied masters: before `61a84e77349525f98f0f03a74520d1770396df440eaf99c96ea074bdfdd7edbd`; after `09c216e6eb24efc720b66bbbf468ecd7cbc5f964253152d5dafd8d23b74277f3`.
- Chromium browser checks passed at 320 × 740, 390 × 844, 768 × 1024 and 1440 × 1000. No horizontal overflow, failed asset requests or JavaScript/console errors were recorded. The primary hero quote button stays within the first viewport; both responsive photographs load without cropping.
- Header/page quote anchors preserve UTM and click query parameters and land below the visible sticky header. Native FAQs work with the keyboard; the mobile menu closes with Escape; service navigation restores the existing contact-page quote destination. Header scrolling was also verified on the homepage, contact, gallery and services pages.
- In the real browser, an invalid email prevents submission. The actual API’s missing-configuration response preserves the entered details, shows an error and focuses it. A mocked provider-accepted response then displays/focuses success; the retry retains its request UUID, and “Send another request” resets the form. No real email credentials were loaded.
- A cache-disabled mobile check with 150 ms latency, 200,000 bytes/second download and 4× CPU slowdown remained usable, reaching network idle in approximately 4.7 seconds locally. This is one synthetic check, not a Core Web Vitals or real-world speed claim.

No real email is sent by the automated checks. The owner has already confirmed inbox delivery for the unchanged form/API in the preceding slice; this is not a new delivery claim for the landing page.

Review screenshots are captured from the local production build: [mobile hero](review/driveway-landing-mobile-hero.png), [complete mobile page](review/driveway-landing-mobile.png), and [desktop page](review/driveway-landing-desktop.png). They do not establish deployed inbox delivery or field performance.

## Phone review

1. Open the preview at the landing-page route, rather than the preview homepage.
2. Check the headline, Gold Coast location, starting price and pricing conditions.
3. Check both complete job photographs and open an original.
4. Try the header, hero and final free-quote links. Each should reach this page’s form without a separate contact-page visit.
5. Check the mobile form, call/email links, FAQs and access to the other services.

Stop for owner review. Do not merge automatically, change the live Google Ad destination or start the conversion-tracking slice. The page must be reviewed and approved for production before it is used as the advertisement destination. Paid-launch conversion measurement and verified business-domain sender setup remain separate follow-ups.
