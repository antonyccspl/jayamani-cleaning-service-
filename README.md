# Tidyday · home cleaning marketplace demo

A static, local-state React Native prototype built with Expo and TypeScript. It is designed for Android and iOS. All prices, identities, availability, and records are illustrative. State lives in memory and resets when the app restarts.

## Run

```sh
npm install
npm start
```

Use the Expo terminal menu to launch an Android emulator, iOS simulator, or Expo Go. `npm run typecheck` checks TypeScript after dependencies are installed.

## Demo flows

- Customer: browse/search/filter Chennai cleaning services without a sign-in prompt. The four browse categories are driven by service category IDs and the active/unpaused service list: Home services (all eligible services), Room cleaning, Fabric care, and Specialty care. Category counts use the same selector as the listings. Service details lead to full-home package selection or a room-by-room clean. Bathroom and kitchen flows support room-specific setup, priced size/count options, optional extras, estimates, and adding configured cleans to the basket or continuing directly to scheduling. Basket selections retain their requirements and add-ons in booking history, and booking-step back navigation preserves the current selections. Checkout supports a shared visit slot/address, demo promo codes, a simulated payment preference, booking tracking, reschedule/cancel requests, and a local post-service review. Guest confirmation accepts any six-digit code after a 10-digit demo phone number; it sends no SMS or payment.
- Employee: submit a local application, then use Admin → Team to approve it. The pre-seeded “Demo cleaner A” is a fictional sample account to make booking assignment immediately explorable. No real identity documents or bank information are requested.
- Admin: open Admin access and enter the demo dashboard. Edit or add services, adjust prices and configured booking questions, review bookings, assign a demo cleaner, approve applications, and update job status.

## Architecture and future integration

- `src/types.ts`: typed service, booking, employee-application, and activity models.
- `src/data/services.ts`: central illustrative catalogue and service rules.
- `src/data/service-categories.ts`: category-to-service mapping for cleaning landing and category listings.
- `src/data/service-categories.test.mjs`: focused Node tests for stable category IDs, listings, counts, invalid IDs, and empty results (`npm run test:categories`).
- `src/data/service-images.ts`: static local photo mapping and fallback source for catalogue and booking imagery.
- `src/theme.ts`: shared palette and visual tokens.
- `src/data/customer-content.ts`: clearly labeled sample cleaning FAQs, reviews, and demo offers.
- `src/utils/pricing.ts`: local itemized quote calculation.
- `src/state/Marketplace.tsx`: in-memory shared state and cross-screen actions.
- `App.tsx`: navigation and customer, employee, and admin experiences.

## Visual reference

The attached mobile recordings informed the customer theme: white surfaces, dark compact typography, fine dividers, purple-led service actions and primary buttons, restrained green semantic status accents, horizontal service rows, and persistent booking actions on service and basket screens. The palette is a visual approximation from the video frames, not a pixel-sampled or pixel-perfect reproduction. The existing Tidyday identity and bundled service photography remain in use; no reference logos, fonts, or promotional assets were copied.

## Local service imagery

The customer catalogue uses bundled sample service photography in `assets/services/`. These are presentation assets for the prototype; confirm usage rights and replace them with licensed brand photography before release.
The Room cleaning category uses the bathroom-cleaning photo as a representative room-service image. The listing uses each service's own mapped photo. No dedicated window-cleaning photo is bundled, so that service currently uses general home-cleaning photography.

The product catalogue, Chennai service areas, packages, reviews, FAQs, offers, availability, cleaner profiles, and bookings are mock data held in app memory. Basket checkout creates one demo visit with its selected services and one shared arrival window. UPI is a selection preview only; no payment, messaging, location lookup, or service request reaches a real provider. These screens are intended for client review before a backend is selected.

Future Supabase work can replace the state actions with repositories for profiles, roles, service configuration, offers, availability, bookings, assignments, status history, and audit records. Firebase Phone Authentication can replace the simulated phone/OTP modal. Validate quotes, authorization, availability, and assignments in a trusted backend before production. The current client-side role switch is demo-only and provides no security boundary.

Before any store release, add production authentication and backend security, privacy and data-retention/deletion policies, required permissions only when features need them, app icons and splash assets, identifiers and signing, store metadata/screenshots, real-device testing, and production build configuration. No backend, payment flow, real OTP, location access, camera, or photo library is connected here.
