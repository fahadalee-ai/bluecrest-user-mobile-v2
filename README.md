# bluecrest-staff-mobile-v2

Logo File Attached

BLUECREST AMENITY MANAGEMENT — STAFF / LIFEGUARD MOBILE APP

COMPLETE Master Build Prompt for Lovable (React, Mobile-First, iOS HIG Compliant)

v2 — Full App: Every Screen, Every Flow

0. PROJECT SUMMARY

This is the complete Staff/Lifeguard mobile app prompt for Bluecrest Amenity Management, replacing the earlier partial version. It covers the entire app end to end: onboarding, authentication, home dashboard, assigned sites, daily task completion, live photo verification, water testing submissions, supervisor chat, incident reporting, and the full staff profile/history section.

Company Details (unchanged): Bluecrest Amenity Management, 105-25 91st St, Ozone Park, NY 11417, NYC metro market. Primary Navy #093370, Primary Blue #0258B8, Heading font Cormorant Upright, Body font Karla.

Design System: This build must strictly follow the iOS HIG design system already established — screen margins 16–20pt, 8pt spacing grid, typography scale (Large Title 34pt / Title 28pt / Headline 17pt / Body 17pt / Subheadline 15pt / Caption 12–13pt), 44×44pt minimum touch targets, 44–50pt buttons, 44pt nav bar / 49pt tab bar, 200–400ms animations, full VoiceOver/Dynamic Type/contrast accessibility, grouped lists with pull-to-refresh, simple one-primary-action alerts, designed empty states everywhere, real hi-res local imagery throughout. Apply this system identically across every screen below — do not restate it per screen, just follow it consistently.

1. COMPLETE APP MAP (every screen in the app)

Splash
Onboarding (3 slides)
Login
No Registration / Invite-Only
Forgot Password
  └─ Reset Confirmation state

── MAIN APP (Bottom Tab Bar: Home | Sites | Camera | Chat | Profile) ──

TAB 1 — HOME
  Home / Dashboard
  Notifications (full list)
  Site Detail (quick view from Home map card)

TAB 2 — SITES & TASKS
  My Sites (list of assigned sites)
  Site Detail (full)
  Task List (per site or all sites)
  Task Detail / Checklist Completion
  Water Testing Form
  Water Testing History (per site)
  Shift Schedule / Calendar

TAB 3 — CAMERA / VERIFY
  Photo Type Selector
  Live Camera Capture
  GPS + Timestamp Confirmation
  Review & Submit
  Submission Success
  My Submitted Photos (history/gallery)

TAB 4 — CHAT
  Conversations List (Direct + Site Group + Broadcasts)
  Chat Thread (individual/group)
  Emergency Broadcast Banner/View
  New Message composer (attach photo/doc)

TAB 5 — PROFILE
  Profile Overview
  Edit Profile
  Certifications & Documents Vault
  Attendance / Shift History
  Incident Reports (My Reports — list)
  Incident Report Form (new)
  Incident Report Detail
  Settings (notifications, password, help, logout)
  Help & Support


Build every screen listed above — this prompt gives full detail for each.

2. AUTHENTICATION FLOW (build exactly as previously specified — summary below for context, full detail unchanged)

Splash — Navy background, Bluecrest logo lockup (Cormorant Upright), tagline, auto-advances after ~1.2s

Onboarding — 3 swipeable slides (Your Site All in One Place / Verify With a Single Tap / Stay Connected With Your Supervisor), skip option, page dots, final "Get Started" button

Login — Email + Password (labels above, inline validation), "Forgot Password?" link, "Sign In" primary button, "Learn How to Get Access" ghost button to No Registration screen

No Registration / Invite-Only — explains accounts are created by Admin/Supervisor only, contact office/HR card, "Back to Sign In" button

Forgot Password — Email field, "Send Reset Link" button, transitions to in-screen success confirmation state with "Resend Email" (30s cooldown) and "Back to Sign In"

(Full detail for these five screens is unchanged from the prior version of this prompt — build them exactly as previously detailed.)

3. TAB 1 — HOME

3.1 Home / Dashboard (unchanged core structure — summarized, keep prior full detail)

Personalized greeting header + notification bell (routes to full Notifications screen now, not just a sheet)

Clock In/Out card — status pill, assigned site name/address, live timer once clocked in, GPS-permission-primed clock-in flow, Clock Out confirmation alert

Live Map card (Google Maps) — guard pin + site pin + geofence radius, tap to expand full-screen

Today's Tasks summary — compact list/chips with status badges, tap-through to Task Detail

Quick Actions row — Submit Water Test / Take Photo / Message Supervisor / Report Incident (routes into Tab 2/3/4 flows respectively)

Recent Activity feed

Pull-to-refresh enabled

Important addition: if the guard has more than one assigned site (e.g., a fill-in shift at a second site this week), the Clock In card must show a site selector (small dropdown/chevron next to the site name) so they clock in at the correct site for that shift — defaulting to today's scheduled site from the Shift Schedule.

3.2 Notifications (full screen)

Nav bar title "Notifications," "Mark all as read" text button top-right

Grouped list: Today / Yesterday / Earlier, each row: icon (type-coded), title, short description, relative timestamp, unread = subtle blue dot + slightly bold text

Row tap routes to the relevant screen (task due → Task Detail, message → Chat Thread, photo approved → My Submitted Photos)

Swipe-to-dismiss per row (per list guidelines)

Empty state: "You're all caught up" + calm icon

Sample notifications: "Water test due in 15 minutes," "Supervisor approved your opening photos," "New message from Supervisor Dana Reyes," "Reminder: Closing checklist due by 6:00 PM," "Your CPR certification expires in 30 days."

4. TAB 2 — SITES & TASKS

4.1 My Sites

Nav bar title "My Sites"

Card list (not dense table — this is mobile, use spacious cards per site): site hi-res photo thumbnail, site name (Headline 17pt bold), address (Subheadline, muted), a status pill showing today's relevance ("Today's Shift," "Scheduled Thu," or "Not Scheduled"), small compliance/task-progress ring (e.g., "3/4 tasks done" mini progress indicator)

Tap any site → Site Detail

If guard has only one assigned site (typical case), still show this screen with a single clean card — don't hide the tab, since it doubles as the entry point to that site's task/water-test history

Sample data: Marcus Bennett is primarily assigned to Manhattan Park Pool Club (Roosevelt Island) full-time, with an occasional fill-in shift at Soho House Rooftop (shown as "Scheduled Thu" for demo variety).

4.2 Site Detail

Hero image of the site (hi-res, full-width, ~200pt height, rounded-bottom into content)

Site name (Title 28pt), address with a small "Open in Maps" icon-link, assigned Supervisor name + small "Message" quick-action button

Embedded small map showing the site pin

Section: Today's Required Tasks — same checklist rows as Home but scoped/complete list for this site, each tappable to Task Detail

Section: Required Photos — visual grid of the required photo types for this site (Opening: Pool, Equipment Room, Rescue Equipment, Chemical Storage; Closing: Pool, Equipment Room, Rescue Equipment) each showing a thumbnail if already submitted today or an empty dashed placeholder with a camera icon if pending — tapping a pending one launches the Camera flow pre-filled with that photo type

Section: Water Testing Schedule — shows interval (e.g., "Every hour, 9 AM–7 PM") and a mini list of today's submitted tests with pass/flag icons, "View Full History" link → Water Testing History

Section: Site Notes — any special instructions from admin/supervisor for this site (e.g., "Gate code: 4471. Equipment room is behind the cabana bar.")

4.3 Task List

Accessible from Home "See All Tasks" or a segment/filter at the top of My Sites

Nav bar title "Tasks," with a filter chip row at top: All / Pending / Due Now / Completed, plus a site filter dropdown if multi-site

Grouped list by task category (Opening / Ongoing / Closing) using section headers per list guidelines

Each row: icon, task name, due time or completion time, status badge, chevron

Pull-to-refresh

Sample tasks for the day (Manhattan Park Pool Club):

Opening Checklist — Completed 9:05 AM

Rescue Equipment Check — Completed 9:10 AM

Chemical Storage Check — Completed 9:12 AM

Hourly Water Test (11:00 AM) — Due Now

Hourly Water Test (12:00 PM) — Pending

Bathroom Inspection — Pending

Closing Checklist — Pending (due 7:00 PM)

4.4 Task Detail / Checklist Completion

Nav bar with task name as title, back chevron

Task metadata card at top: site name, due time, assigned by (template source), status badge

Checklist items list — each item is a row with a checkbox/toggle (large tappable circle, 44pt target), item label, and if that item requires photo proof, a small camera icon button next to it that launches the Camera flow scoped to that item and auto-attaches the result back to this checklist item once submitted (shown as a small thumbnail once done)

Notes field at the bottom — multi-line text area, labeled "Notes (optional)," placeholder "Add any comments about this task..."

Sticky bottom "Mark Task Complete" primary button — disabled until all required items are checked/photo-attached; once tapped, brief success animation, status updates to "Completed," and if the task template requires supervisor sign-off, show a small badge "Awaiting Supervisor Review" instead of a plain "Completed" so the guard knows it's not fully closed yet

Sample checklist for Opening Checklist:

Unlock and inspect pool gate/fencing

Test and log water chemistry (links to Water Testing Form)

Inspect rescue equipment (photo required)

Check first aid kit stock

Set up signage and safety flags

Confirm chemical storage is locked and photographed (photo required)

4.5 Water Testing Form

Nav bar title "Water Test — [Site Name]"

Top: Body of Water selector (segmented control: Main Pool / Spa / Kiddie Pool)

Form fields (labels above, numeric keypad where relevant):

Free Chlorine / Sanitizer (ppm) — numeric input with a small visual range indicator bar showing the acceptable band and where the entered value falls (green/amber/red zone)

pH — numeric input, same visual range indicator

Temperature (°F) — numeric input

Bather Count — numeric stepper (+/-)

If any reading falls outside the acceptable range, an inline warning banner appears: "Chlorine reading is below the safe range. Please add a corrective action note." and a Corrective Action text area becomes required (auto-expands into view with a smooth 300ms animation)

Attach Verification Photo — required button that launches the live Camera flow scoped to "Water Test Verification," shows thumbnail once captured

Sticky bottom "Submit Water Test" primary button — disabled until required fields + photo are complete

On submit: success animation, brief toast "Water test submitted," auto-navigates back to Task List/Site Detail with that test now marked complete

4.6 Water Testing History

Nav bar title "Water Test History"

Filter row: date range, body of water

List of past submissions: time, readings summary (chlorine/pH/temp as small inline stats), status icon (within range / flagged / corrective action logged), tap row → read-only detail view of that submission (same gauge-style visual as the form, but locked, showing the attached photo and any supervisor sign-off status)

4.7 Shift Schedule / Calendar

Nav bar title "My Schedule"

Week-view calendar strip at top (horizontally scrollable days, today highlighted in Primary Blue)

Below: list of shifts for the selected day/week — site name, time range, role note if applicable ("Fill-in coverage")

Tap a shift → small detail sheet: site, time, supervisor contact, any special instructions

Empty state for days off: "No shift scheduled" with a calm icon

5. TAB 3 — CAMERA / VERIFY (Live Photo Verification Flow)

This is a core anti-fraud feature — the flow must make it structurally impossible to select a gallery photo.

5.1 Photo Type Selector

Nav bar title "Verify Photo"

Grid of required photo types for the guard's current site, grouped Opening / Closing / Water Test Verification / Incident (contextual — if arriving from a specific task/checklist item, this screen is skipped and the camera opens directly, pre-tagged)

Each grid tile: icon + label (Pool, Equipment Room, Rescue Equipment, Chemical Storage), with a small checkmark overlay if already submitted today, and a "Retake" label instead of tap-to-capture if so (still routes through live camera again, never allows picking an old one)

5.2 Live Camera Capture

Full-screen native-style camera viewfinder (build as a styled camera UI component — rear camera default)

Top overlay: small label showing what's being captured ("Opening — Equipment Room"), a subtle live GPS status chip ("Location Verified ✓" in green, or "Locating..." while acquiring)

Bottom: large circular capture button (per touch target rules, sized generously ~70pt for a primary camera action — this is an accepted iOS camera-UI exception to the 44pt minimum, since it's the single dominant action), flash toggle icon, close/cancel icon

No gallery/photo-library icon anywhere on this screen — this is a strict requirement, reinforce clearly in the build notes

On capture: brief shutter animation, auto-advances to Confirmation screen

5.3 GPS + Timestamp Confirmation

Shows the captured photo full-screen with a semi-transparent bottom overlay card containing:

Timestamp (auto-generated, current date/time)

GPS coordinates + resolved address, with a small green "✓ Verified at [Site Name]" badge if within the site's geofence radius, or a red warning badge "⚠ You appear to be outside the site radius — please confirm you're on-site" if not (with a "Retake" and "Submit Anyway" pair of options in the flagged case, the latter requiring a short required note)

Small map thumbnail showing the pin

Two buttons: Retake (ghost, returns to camera) and Use Photo (primary, advances to Review & Submit)

5.4 Review & Submit

Photo thumbnail + all metadata summarized (type, site, timestamp, GPS)

Optional short caption/note field

Primary button "Submit Photo"

On submit: success animation (checkmark burst), toast "Photo submitted for [Type]," returns to the calling context (Task checklist item, Site Detail photo grid, or Photo Type Selector grid now showing the checkmark)

5.5 My Submitted Photos (history/gallery)

Accessible from Profile or a "History" icon on the Photo Type Selector nav bar

Grid gallery view, filter by date/site/type

Each thumbnail shows a small verified badge; tap → read-only detail (same layout as 5.3 confirmation but locked, plus supervisor approval status: "Approved" green check or "Pending Review" amber clock icon)

6. TAB 4 — CHAT (WhatsApp Replacement)

6.1 Conversations List

Nav bar title "Messages," small compose icon top-right (for starting a new direct message, limited to their supervisor(s) — guards cannot message arbitrary staff)

Segmented control or simple grouping: Direct / Site Group / Announcements

Each row: avatar (person for direct, site photo/icon for group, megaphone icon for announcements), name/title, last message preview (truncated), timestamp, unread count badge

Announcements/Emergency Broadcasts pinned to top with a distinct red-tinted row style when unread and urgent

Empty state: "No messages yet" + "Message your Supervisor" primary button

6.2 Chat Thread

Nav bar: recipient name/title + small "online/last seen" status subtext, back chevron

Message bubbles: sent messages right-aligned in Primary Blue with white text, received messages left-aligned in light grey with navy text, timestamps shown on long-press or grouped subtly under bubble clusters

Support for photo/document message bubbles (thumbnail preview, tap to expand)

Read receipt indicator (small double-check icon, grey = sent/delivered, blue = read) under the guard's own last message

Bottom input bar: text field (expands up to ~4 lines), camera icon (launches Camera flow, result attaches as a message), attach/document icon, send button (Primary Blue circular, disabled when empty)

Typing indicator (animated three-dot bubble) styled for when the supervisor is typing (simulate for demo)

6.3 Emergency Broadcast View

When an urgent Administrator announcement is received, show it both as a pinned red-tinted thread in the list (6.1) AND optionally as a full-screen important alert modal on next app open if unread + marked urgent — title "Important Announcement," message body, single "Got It" acknowledgment button, timestamp/sender ("Bluecrest Admin") shown clearly

6.4 New Message Composer

Simple recipient confirmation (auto-set to their assigned Supervisor, shown as a small header chip), then straight into a thread-style compose view reusing the Chat Thread input bar

Sample chat data: thread with Supervisor Dana Reyes — "Reminder: water testing kit restock arrives today, log the new lot number," guard reply "Got it, thanks!"; a Site Group thread for Manhattan Park Pool Club with 3 other guards + Dana; one sample Emergency Broadcast from Bluecrest Admin: "Heat advisory in effect today — ensure all guards are rotating shade breaks every hour."

7. TAB 5 — PROFILE

7.1 Profile Overview

Header: large circular avatar photo, name (Title 28pt), role/title ("Certified Lifeguard"), Employee ID (Caption, muted)

Quick stat row: This Month's Attendance %, Tasks Completed, On-Time Rate — shown as small stat tiles

Grouped menu list (per list guidelines, standard iOS settings-style rows with chevrons):

Edit Profile

Certifications & Documents

Attendance / Shift History

My Incident Reports

Settings

Help & Support

Log Out (styled in red, separated at the bottom, with a confirmation alert)

7.2 Edit Profile

Avatar with "Change Photo" overlay button (routes through the same live-camera-only capture pattern, or allow gallery here since this is a personal profile photo, not a compliance-verification photo — this is the one appropriate exception)

Form: Full Name, Phone, Email (read-only or admin-managed, shown greyed with a note "Contact your supervisor to update this"), Emergency Contact Name + Phone

"Save Changes" primary button

7.3 Certifications & Documents Vault

List of certification cards: Cert name, issuing body, issue date, expiry date with a color-coded status (green = valid, amber = expiring within 60 days, red = expired), small document thumbnail/icon, "View" button opens the document (PDF-style viewer)

"Upload New Document" secondary button at bottom for renewals (opens a simple file/photo picker — appropriate exception again, since this is an administrative document upload, not a live-verification photo)

Sample certs: Red Cross Lifeguard Certification (exp. 03/15/2027), CPR/AED/First Aid (exp. 09/2026 — shown amber as "expiring soon" for demo), Bloodborne Pathogens Training (exp. 01/2027).

7.4 Attendance / Shift History

Month calendar view (per-day dots: green = full shift completed, amber = partial/late, grey = scheduled off) with a swipeable month selector

Below: list view alternative toggle — chronological shift log entries: date, site, clock-in/out times, total hours, status badge

Tap an entry → simple detail sheet with that day's full clock-in/out timestamps and site

7.5 My Incident Reports (list)

List of previously submitted incident reports: type icon, short title/site, date, status (Open/Under Review/Resolved badge)

Top-right "+ New Report" button → Incident Report Form

Empty state: "No incidents reported" + calm reassuring icon (avoid alarming empty-state tone here)

7.6 Incident Report Form (new)

Nav bar title "Report Incident"

Incident Type selector — icon grid: Injury, Rescue, Chemical Issue, Equipment Damage, Weather Closure, Rule Violation

Site (auto-filled to current/assigned site, editable dropdown if multi-site)

Description — multi-line text area, labeled, placeholder guiding detail ("What happened? Who was involved? What action was taken?")

Severity — segmented control: Low / Medium / High / Critical (Critical triggers a small inline note: "This will immediately notify your Supervisor and Bluecrest Admin")

Attach Photo(s) — launches the live Camera flow (same anti-fraud pattern), supports multiple photos, shown as a thumbnail row with remove option

Date/Time — auto-filled to now, editable if reporting a past incident

Sticky bottom "Submit Report" primary button — for Critical severity, show a confirmation Alert before final submit: "Submit Critical Incident Report?" with Submit/Cancel

On submit: success confirmation screen — "Report Submitted," summary of what was sent and to whom, "Done" button returns to Incident Reports list

7.7 Incident Report Detail (view an existing submitted report)

Read-only version of the form layout: type, site, description, severity badge, photos, timestamp, plus a Status Timeline at the bottom showing supervisor/admin actions ("Submitted," "Under Review by Dana Reyes," "Resolved — [resolution note]") and a linked "View in Chat" shortcut if the incident thread connects to a chat conversation

7.8 Settings

Grouped list: Push Notifications (toggle + granular sub-toggles: Task Reminders, Chat Messages, Water Test Due, Announcements), Change Password (routes to a simple current/new/confirm form), App Appearance (Light/Dark/System — optional nice-to-have toggle), Language (English default, greyed placeholder for future), Help & Support, About Bluecrest (version number, company address/website footer), Log Out

7.9 Help & Support

Simple FAQ-style grouped list (accordion-style expandable rows) covering common questions: "How do I clock in?", "What if my photo won't verify my location?", "Who do I contact if I forgot my password and I'm not near a computer?" — plus a "Contact Bluecrest Office" card with phone/email, matching the pattern from the No Registration screen

8. SAMPLE DATA SUMMARY (consistent across all screens)

Staff member: Marcus Bennett, BC-1042, Certified Lifeguard, primary site Manhattan Park Pool Club (Roosevelt Island, NY), occasional fill-in at Soho House Rooftop (Meatpacking District)

Supervisor: Dana Reyes

Today's date context: Friday, demo default state = before clock-in (~8:55 AM)

Tasks: as listed in Section 4.3

Certifications: as listed in Section 7.3

Chat: as listed in Section 6 sample data

Incidents: one past resolved sample ("Minor slip near pool deck — wet floor, cordoned off and dried, no injury — Resolved") to populate the Incident Reports list with a realistic non-alarming example

Notifications: as listed in Section 3.2

9. TECHNICAL NOTES (build-wide, unchanged principles + additions for this full version)

Persistent bottom tab bar across all 5 tabs; nested stack navigation within each tab (e.g., My Sites → Site Detail → Task Detail → Water Testing Form all push within the Sites & Tasks tab stack, preserving back-navigation correctly)

Camera flow (Section 5) should be built as a reusable component/flow that can be launched from multiple entry points (Tab 3 directly, a checklist item's photo button, the Water Testing Form's photo requirement, and the Incident Report form) — always returning the captured result back to whichever context launched it

Mock/local state is sufficient for all data (no real backend needed) — structure sample data in clearly organized local JS/TS data files so it's easy to extend later

Reuse the design system components (buttons, cards, badges, list rows, form fields) built in the earlier phase — do not rebuild inconsistent one-off styles per screen

Maintain the strict rule: anywhere the app captures a compliance/verification photo (task photos, water test photos, incident photos), it must go through the live-camera-only flow with GPS+timestamp — the only exceptions are the personal Profile avatar photo and certification document uploads, which may use a standard file/photo picker since they are administrative, not verification, artifacts

End of complete master prompt. This replaces the earlier partial version. Build in this order: Section 2 (Auth) → Section 3 (Home) → Section 4 (Sites & Tasks) → Section 5 (Camera flow) → Section 6 (Chat) → Section 7 (Profile), confirming each section renders and navigates correctly before moving to the next.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/562f3aab-b302-43d3-84d4-c3e1af9fff06).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
