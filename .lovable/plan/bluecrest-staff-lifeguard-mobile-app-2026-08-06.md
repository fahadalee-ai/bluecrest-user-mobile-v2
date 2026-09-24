# Bluecrest Staff / Lifeguard Mobile App

A mobile-first, iOS-HIG-styled staff app for Bluecrest Amenity Management: auth, dashboard, sites & tasks, live photo verification, chat, and profile. All data is mock/local — no backend — so screens and flows can be demoed end to end.

## Design system

- Colors: Navy #093370 (primary), Blue #0258B8 (accent), light neutral surfaces; all as semantic tokens in `src/styles.css`.
- Fonts: Cormorant Upright (headings), Karla (body), loaded via a `<link>` in the root route.
- iOS HIG rules applied globally: 16–20pt screen margins, 8pt spacing grid, type scale (34/28/17/17/15/13), 44pt min touch targets, 44pt nav bar, 49pt tab bar, 200–400ms transitions, grouped list rows, pull-to-refresh, designed empty states.
- Shared primitives built once and reused: NavBar, TabBar, Button, Card, StatusBadge, ListRow, FormField, SegmentedControl, Alert/Sheet, EmptyState, Toast.
- Logo used as the app brand mark on Splash/Login and set as the favicon.

## Build order

**1. Shell + auth**
Splash (navy, logo, ~1.2s auto-advance) → Onboarding (3 slides, dots, skip, Get Started) → Login (email/password, inline validation) → No Registration / Invite-Only → Forgot Password with in-screen success state and 30s resend cooldown.

**2. Tab 1 — Home**
Dashboard: greeting header + bell, Clock In/Out card with site selector and live timer, map card with guard pin / site pin / geofence, today's tasks summary, quick actions row, recent activity, pull-to-refresh. Plus full Notifications screen (grouped Today/Yesterday/Earlier, unread dots, swipe-to-dismiss, deep links) and quick Site Detail.

**3. Tab 2 — Sites & Tasks**
My Sites (spacious cards, shift status pill, task progress ring) → Site Detail (hero image, supervisor, map, today's tasks, required-photo grid, water testing schedule, site notes) → Task List (filter chips, grouped Opening/Ongoing/Closing) → Task Detail (checklist with per-item photo proof, notes, sticky Complete button, "Awaiting Supervisor Review" state) → Water Testing Form (body-of-water segments, readings with green/amber/red range bars, bather stepper, conditional corrective-action field, required verification photo) → Water Testing History → Shift Schedule week strip.

**4. Tab 3 — Camera / Verify**
Reusable capture flow: Photo Type Selector → Live Camera Capture (no gallery affordance anywhere) → GPS + Timestamp Confirmation with geofence verified/warning states → Review & Submit → Success. Plus My Submitted Photos gallery with approval status. Launchable from checklist items, water test form, and incident form, always returning to the caller.

**5. Tab 4 — Chat**
Conversations List (Direct / Site Group / Announcements, pinned red urgent broadcasts), Chat Thread (bubbles, photo/doc messages, read receipts, typing indicator, camera/attach input bar), Emergency Broadcast modal with "Got It", New Message composer scoped to the supervisor.

**6. Tab 5 — Profile**
Profile Overview (avatar, stat tiles, grouped menu, red Log Out with confirm), Edit Profile, Certifications Vault (color-coded expiry), Attendance calendar + list toggle, My Incident Reports, Incident Report Form (type grid, severity with Critical confirm alert, live photo attach), Incident Report Detail with status timeline, Settings (notification toggles, change password, appearance, about), Help & Support FAQ accordion + contact card.

## Sample data

Marcus Bennett (BC-1042, Certified Lifeguard), primary site Manhattan Park Pool Club, fill-in at Soho House Rooftop, Supervisor Dana Reyes; tasks, certs, chat threads, notifications, and one resolved incident exactly as specified. Demo default state: Friday ~8:55 AM, before clock-in.

## Technical notes

- TanStack Router file routes: `/` (splash/auth entry), auth routes, and a persistent tab layout route wrapping `home`, `sites`, `camera`, `chat`, `profile` subtrees so nested pushes keep the tab bar and back navigation.
- All mock data in `src/data/*.ts`; app state (clock-in, task completion, submitted photos, messages, reports) in a light React context so actions persist across screens for the session.
- Camera uses `getUserMedia` with a rear-camera preference and a styled viewfinder; GPS from the browser geolocation API with a mocked geofence check and graceful fallbacks if permissions are denied.
- Site/hero imagery generated as local hi-res assets.
- Each route gets its own head() title/description.
