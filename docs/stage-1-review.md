# Stage 1 — homepage and authentic gallery review

**Status: human review required. No merge or production deployment authorised.**

## Scope of this preview

- Existing black, gold and purple identity and genuine logos retained.
- Homepage leads with driveway pressure cleaning on the Gold Coast, packages from $169, clear starting-price conditions, quote and phone actions.
- Homepage and gallery show one genuine job using side-by-side photographs, with original aspect ratios and no colour, concrete, stain or lighting alterations. Originals can be opened from either image. No sample project cards or unverified job suburbs remain.
- Mobile header exposes Call and Free quote; collapsed navigation links leave the keyboard tab order and Escape closes the menu.
- Smaller existing wordmark and background derivatives reduce downloads. All original branding files remain.
- Basic build stabilisation: repaired lockfile, runnable ESLint command, lazy Resend initialisation, and provider errors return failure instead of success. Existing quote fields and sender configuration retained for this stage.

## Owner review refinement

After the owner reviewed the first mobile preview, the hero was simplified: one short driveway-cleaning heading, one Gold Coast location line, an unboxed starting price, and one primary quote button with a quieter phone link. The longer business tagline and Messenger action remain further down the homepage. Gallery and image files are unchanged. This refinement still requires owner review before merge.

## Deliberately deferred

Broader quote-form validation/spam/idempotency work, dedicated driveway landing page, metadata/schema/sitemap additions, contact-page changes and optional Google measurement are preserved in the earlier checkpoint commit `ba6d27d39db5421b0a9e1282e8b700db8c3a998a`. They are excluded from this stage’s final tree. That checkpoint compiled and its 12 quote-handler tests passed before the scope changed; these results do not claim that the stage-1 quote form has those deferred protections.

No tracking library, Google ID, Ads campaign, production environment or production domain is changed. The existing unmerged Vercel Analytics PR #1 is untouched.

## Review on a phone

1. Open the homepage: check logo size, headline, starting offer and price conditions.
2. Try Call, Free quote, the navigation menu and Messenger link.
3. Scroll to the real-work section. Compare the photographs and open an original.
4. Open Gallery: check both complete photographs, captions and contact buttons.
5. Send design feedback. A successful build is not approval to publish.

## Validation and limits

`npm run build` passes. Type check and ESLint are run before handoff; ESLint reports six image-usage advisories in existing img-tag locations, with responsive photography handled by picture/srcset. Older Browserslist data also produces a build advisory. Original image SHA-256 values:

- Before: `61a84e77349525f98f0f03a74520d1770396df440eaf99c96ea074bdfdd7edbd`
- After: `09c216e6eb24efc720b66bbbf468ecd7cbc5f964253152d5dafd8d23b74277f3`

No real email-delivery test is claimed. The current sender remains `onboarding@resend.dev`; verified-domain setup and inbox confirmation remain required before an advertising launch. Server rate limiting, full server validation and conversion tracking belong to later review stages.

The next implementation phase must wait for explicit owner approval.
