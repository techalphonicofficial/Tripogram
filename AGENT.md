# AGENT.md

## Changes Made

### 1. Removed All Indexing
- Removed indexing logic from the following files:
  - `src/components/WhyChooseUs/WhyUs.jsx`
  - `src/components/UpcomingTripSection/UpcomingTripMain.js`
  - `src/components/Partials/HeaderMob.js`
  - `src/components/Partials/Footer.js`
  - `src/components/AboutSection/AboutSection.js`

### 2. Updated Project Theme
- Applied the following theme colors:
  - **Primary Color:** `#0598cc`
  - **Secondary Color:** `#ffb827`
- Updated color references in:
  - `src/components/UpcomingTripSection/UpcomingTripMain.js`
  - `src/components/AboutSection/AboutSection.js`

### 3. Replaced Green Color with Primary Color
- Updated all references of green color to the primary color (`#0598cc`) in the following files:
  - `src/app/globals.css`
  - `src/components/Hero/Hero.css`
## Tripogram Migration Completed

### 1. Updated Visible Brand Text
- Replaced the previous brand name with `Tripogram` across source files, metadata, package files, deployment scripts, and release config.
- Updated visible copy in pages, blog components, trip detail components, footer alt text, cancellation policy, and booking/payment UI.

### 2. Updated SEO Metadata
- Updated app metadata, Open Graph metadata, Twitter metadata, author/site name, descriptions, and image alt text to use `Tripogram`.
- Updated sitemap and robots defaults to use the Tripogram website URL.

### 3. Updated Package and Deployment Names
- Renamed package/app process metadata to `tripogram`.
- Updated deployment script paths, vhost references, redirect rules, and release config to the Tripogram domain naming.

### 4. Updated Domains and API Defaults
- Website default URL is now `https://www.tripogram.com`.
- Dashboard/API default URL is now `https://dashboard.tripogram.com/api`.
- API config now supports environment overrides through `NEXT_PUBLIC_API_URL`.
- Image host config now supports `NEXT_PUBLIC_DASHBOARD_HOST`.
- Site redirect config now supports `NEXT_PUBLIC_SITE_URL`.

### 5. Updated Booking Storage Keys
- Booking drafts now save under `tripogram_${slug}`.
- Added a booking storage helper with compatibility for the legacy key so existing draft bookings can still be read and migrated.
- Updated booking date selection, occupancy, payment type, billing details, trip summary, and pricing flow to use the helper.

### 6. Updated Payment Branding
- Razorpay/payment modal brand name now uses `Tripogram`.
- Booking create-payment and update-payment calls now use the shared API client instead of hardcoded full API URLs.

### 7. Updated WhatsApp Copy
- Floating footer WhatsApp and footer social WhatsApp use Tripogram message copy.
- Trip detail share modal also uses Tripogram share behavior.

### 8. Build Output Guidance
- Generated `.next` and `release/.next` chunks should be refreshed by rebuilding the app.
- Do not use generated chunks as the source of truth; update source files first, then run a fresh build/release export.

### 9. Verification Commands
- `rg -n -i "tripogram" src public next.config.mjs package.json package-lock.json`
- Search for previous-brand leftovers across source, config, and release files, excluding generated build output and dependencies.
- `npm run lint`
- `npm run build`

## Future Design Refresh Ideas

## 2026-05-20 Homepage Typography Suggestions

### 1. Premium Travel Clean
- Use `Manrope` for headings and buttons with a stronger weight range, and import/use `Inter` for body text so paragraphs, cards, and search UI stay highly readable.
- Best fit for Tripogram if the goal is modern, trustworthy, and conversion-focused.
- Suggested CSS direction: `--title-font: "Manrope", sans-serif; --body-font: "Inter", sans-serif; --style-font: "Montez", cursive;`

### 2. Editorial Escape
- Use a refined serif like `Playfair Display` or `Cormorant Garamond` for large homepage headings, paired with `Manrope` or `Inter` for all UI and paragraph text.
- Best fit if the homepage should feel more premium, magazine-like, and destination-led.
- Use sparingly on hero and section titles only so trip cards and booking actions remain clean.

### 3. Friendly Adventure
- Use `Plus Jakarta Sans` or `Outfit` for headings and body text, keeping `Montez` only for small accent subtitles.
- Best fit if Tripogram should feel younger, energetic, and approachable.
- Works well with the existing blue/yellow palette and rounded travel-card styling.

### 4. Recommended Direction
- Choose **Premium Travel Clean** first because it matches the current codebase, avoids a heavy redesign, improves readability, and keeps the Tripogram brand polished.
- If implementing, import `Inter` in `src/app/layout.js`, expose its CSS variable on `<body>`, and update the root font variables in `src/app/globals.css`.

## 2026-05-20 Tour Category Slider Update

### 1. Converted Curved Slider to Straight Slider
- Removed the curve animation loop from `src/components/TourCategories/CurveSlider.js` that applied per-frame `translate` and `rotate` transforms to category cards.
- Updated Swiper spacing and breakpoints so the Tour Categories carousel displays as a straight horizontal slider.
- Removed the curve-only `single` class from `src/components/TourCategories/CategoriesCard.js`.
- Added category slider CSS overrides in `src/app/globals.css` to keep slides aligned, stretched evenly, and free of leftover transforms.

## 2026-05-20 Homepage Font Refresh

### 1. Added New Homepage Typography
- Added `Inter` and `Playfair_Display` through `next/font/google` in `src/app/layout.js`.
- Kept `Manrope` for functional headings, cards, buttons, and navigation while using `Inter` for cleaner body/UI text.
- Added `Playfair_Display` as the homepage display heading font to give hero and section titles a more editorial travel feel.

### 2. Scoped Homepage Styling
- Wrapped homepage sections in `<main className="home-page">` inside `src/app/page.js`.
- Added `.home-page` typography overrides in `src/app/globals.css` so the homepage feels different without forcing the same style onto trip detail, booking, blog, or policy pages.
- Updated hero headline, animated destination text, section subtitles, stats, card titles, buttons, and category links for the new homepage type system.

## 2026-05-20 Next.js Issue Fixes

### 1. Fixed Invalid Next Config
- Removed the unsupported `eslint` block from `next.config.mjs` because Next.js 16 no longer supports `eslint` configuration inside `next.config.mjs`.
- This fixed the build warnings for unsupported eslint configuration and invalid next config keys.

### 2. Cleared Stale Build Artifacts
- Removed stale generated `.next` output after old trace/build files caused Windows `EPERM` write/unlink failures during `next build`.
- A fresh `npm run build` now recreates `.next` cleanly.

### 3. Fixed Metadata Base Warning
- Added `metadataBase` in `src/app/layout.js` using `NEXT_PUBLIC_SITE_URL` with a Tripogram fallback.
- Updated Open Graph `url` to use the same site URL so social image URLs no longer resolve against `localhost:3000` during production builds.

## 2026-05-20 AboutSection Key Warning Fix

### 1. Fixed Missing Unique Keys
- Updated the mapped `AboutItem` list in `src/components/AboutSection/AboutSection.js` to use a stable fallback key when CMS items do not include `item.id`.
- Removed the unused `faStarHalf` import from the same file.

## 2026-05-20 WhyUs Key Warning Fix

### 1. Fixed Missing Unique Keys
- Updated `src/components/WhyChooseUs/WhyUs.jsx` so grouped CMS card data carries a stable key from the image section id or a deterministic fallback.
- Applied the key to the outer mapped column and removed the duplicate/missing key from the nested motion card.
- Removed unused `axios` and skeleton imports from the same component.

## 2026-05-20 Testimonial Design Refresh

### 1. Updated Homepage Testimonial Styling
- Added a `tripogram-testimonials` class to `src/components/TestimonialSection/TestimonialSection.js` so the testimonial refresh can be scoped to the homepage section.
- Updated testimonial cards in `src/app/globals.css` with white review panels, subtle blue borders, soft shadows, avatar gradient rings, compact rating pills, and cleaner mobile spacing.
- Changed testimonial slide keys to use CMS ids when available with a name/index fallback.
- Replaced inline star colors with CSS-driven styling and added an accessible rating label.

## 2026-05-20 PopularTour API Fallback Fix

### 1. Prevented Homepage Crash on API Timeout
- Updated `src/components/PopularTour/PopularTour.js` to fetch section copy and trending packages with `Promise.allSettled`.
- Added fallback Popular Tour heading/content when `getPagewithSection(1, "popular_tour")` fails with no server response.
- Hidden the Popular Tour section when trending packages are unavailable instead of throwing a runtime error.
- Hardened `src/components/PopularTour/TourCard.js` so missing `package_dates` does not crash date rendering.

## 2026-05-20 Footer Company Info Scope

### 1. Limited `companyInfo` Usage in Footer
- Updated `src/components/Partials/Footer.js` so `companyInfo` is only used for the footer logo image.
- Moved footer contact, copyright, GST, website, and floating phone button values into footer-local constants.

## 2026-05-20 Footer Address Map Link

### 1. Simplified Footer Address Widget
- Updated `src/components/Partials/Footer.js` so the footer Address widget only displays the company address.
- Linked the address to Google Maps in a new tab.
- Removed the phone and email rows from the footer Address widget while keeping the floating phone/WhatsApp buttons unchanged.

## 2026-05-20 Footer Backend Contact Rows

### 1. Added Backend Phone and Email Above Address
- Updated `src/components/Partials/Footer.js` to extract phone and email values from the footer backend payload.
- Added conditional phone and email rows above the Google Maps address link in the footer Address widget.
- Kept these contact rows independent from `companyInfo`; `companyInfo` remains used only for the footer logo.

## 2026-05-20 Booking Detail Build Fix

### 1. Fixed `/booking-detail` Prerender Failure
- Moved the client booking form from `src/app/booking-detail/page.js` into `src/app/booking-detail/BookingDetailClient.js`.
- Added a server route wrapper at `src/app/booking-detail/page.js` with `dynamic = "force-dynamic"` so the query-param driven booking-detail page is not statically prerendered.

### 2. Fixed Null Footer Link Prerender Failure
- Added safe fallbacks for footer social links in `src/components/Partials/Footer.js`.
- This prevents `next/link` from receiving null backend URLs, which caused the `Cannot destructure property 'auth' of 'a' as it is null` prerender error.

## 2026-05-20 Redlake Static Export Conversion

### 1. Enabled Static Hosting Output
- Updated `next.config.mjs` to use `output: "export"` and `trailingSlash: true` for File Manager/public_html hosting.
- Kept `images.unoptimized = true` so Next image output works without a Node.js image optimizer.
- Removed server-only redirect config that is not supported in static export mode.

### 2. Added Static Params for Dynamic Routes
- Added `generateStaticParams()` support for package, booking, blog detail, trip, and destination dynamic pages.
- Used the home destinations endpoint for destination static params because it includes slugs needed for `/destination/[slug]`.
- Removed `force-dynamic` usage from pages/routes that need to export as static files.

### 3. Fixed Static Export Blockers
- Updated `/blog` to export the first blog page statically instead of reading server `searchParams`.
- Removed `connection()` from `/cancellation-policy` so policy content can be fetched and rendered at build time.
- Updated `robots.txt` and `sitemap.xml` routes for static export compatibility.

### 4. Verification
- Ran `npm.cmd run build` successfully.
- Static files were generated in the `out/` directory for upload to Redlake `public_html`.

### 1. Strengthen Tripogram Brand Identity
- Use the Tripogram blue `#0598cc` as the main action/accent color and the yellow `#ffb827` only for highlights, pins, badges, and small attention elements.
- Replace any remaining generic travel imagery with visuals that feel more curated, premium, and destination-focused.
- Use the new Tripogram logo consistently in header, footer, favicon, share fallback image, and metadata.

### 2. Refresh Homepage Sections
- Make the hero feel more like a travel discovery product instead of a template landing section.
- Add stronger destination imagery, clearer search/filter affordances, and a more polished call-to-action area.
- Update "Why Choose Us" cards with cleaner borders, softer shadows, consistent icon treatment, and less visual noise.
- Give upcoming trip cards a more modern layout with clearer price, duration, batch/date, and booking actions.

### 3. Improve Typography and Spacing
- Standardize heading sizes across homepage, trip detail, blog, and booking pages.
- Increase vertical spacing between major sections so the site feels calmer and more premium.
- Reduce oversized text inside compact cards and controls.
- Keep button labels and card text from wrapping awkwardly on mobile.

### 4. Modernize Cards and Buttons
- Use consistent border radius, preferably `8px` or less for utility cards and controls unless a section intentionally needs rounded travel-card styling.
- Replace mixed green/success styling with primary blue, neutral grays, and yellow highlights.
- Add consistent hover states for cards, trip tiles, buttons, and icon buttons.
- Make primary buttons visually consistent across hero, trip detail, booking, contact, and footer.

### 5. Upgrade Header and Navigation
- Tune logo sizing for desktop and mobile so it feels intentional and balanced.
- Make the sticky header more polished with a subtle shadow, active nav state, and clean mobile menu spacing.
- Keep top contact info concise and aligned with Tripogram owner details.

### 6. Improve Footer and Trust Signals
- Add Tripogram Club OPC Pvt Ltd, GST, address, phone, email, and website in a clean business-info block.
- Replace dense footer content with clearer columns: Brand, Trips, Policies, Contact.
- Add trust badges only if they are real and useful, such as secure payment, verified operator, GST registered, and support.

### 7. Refresh Trip Detail Pages
- Make the trip detail hero and booking CTA area feel more premium and easier to scan.
- Keep batches, pricing, itinerary, inclusions, gallery, and FAQs visually distinct but consistent.
- Use blue for active states and selected batches, with yellow for urgent/highlight badges only.

### 8. Improve Booking Flow
- Make the stepper, selected batch, occupancy, coupon, and payment summary feel like one cohesive checkout system.
- Reduce visual clutter and make totals, discounts, GST, and payable amount easier to understand.
- Keep all localStorage keys and payment branding under Tripogram naming.

### 9. Polish Mobile Experience
- Check every major page at mobile widths for text overflow, cramped buttons, and image cropping.
- Keep floating call/WhatsApp buttons from overlapping important booking or footer content.
- Ensure trip cards, batch cards, and pricing rows stay readable without horizontal scrolling.

### 10. Verification Before Release
- Run visual checks on homepage, trip detail, booking flow, blog, contact, and footer.
- Run `rg -n -i "green|#52b100|#329c02|#429b0d|enlive|enlivetrips" src public`.
- Run targeted lint on changed files.
- Rebuild the app after source changes so `.next` and `release/.next` output refresh cleanly.
